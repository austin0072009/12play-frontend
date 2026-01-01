// src/utils/request.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import CryptoJS from 'crypto-js';
import i18n from '../i18n';
import { useUserStore } from '../store/user';
import { showAlert } from '../store/alert';

// ------- 1) 还原 bt0a / at0b -------
function makeAt0bFromSeed(seed: string): number {
  // 老代码：把 seed 拆成两位数一组，每组减去 '0'.charCodeAt(0)=48，然后字符串拼接
  // '575048505557' -> ['57','50','48','50','55','57'] -> [9,2,0,2,7,9] -> '920279'
  var ss = '';
  for (var i = 0; i < seed.length / 2; i++) {
    var pair = seed.substr(i * 2, 2);
    ss += String(parseInt(pair, 10) - 48);
  }
  // at0b() 返回 ss ^ 11111
  return (Number(ss) ^ 11111) | 0;
}
const AT0B_CONST = makeAt0bFromSeed('575048505557'); // == 926128

function bt0a(param: string): string {
  // 注意顺序：9->0，再 1->2，再 5->1
  var s = String(param);
  s = s.replace(/9/g, '0');
  s = s.replace(/1/g, '2');
  s = s.replace(/5/g, '1');
  return s;
}

// ------- 2) AES 解密（老项目 data 字段用的） -------
const IV = CryptoJS.enc.Utf8.parse('pJfjDnI2V1Gvcia0');
const KEY = CryptoJS.enc.Utf8.parse('8739216015203896');
function aesDecryptToJson(enc: string): any {
  var decrypted = CryptoJS.AES.decrypt(enc, KEY, { iv: IV, padding: CryptoJS.pad.Pkcs7 });
  var jsonStr = decrypted.toString(CryptoJS.enc.Utf8);
  try { return JSON.parse(jsonStr); } catch { return jsonStr; }
}

// ------- 3) 时间校正（/nweb/getpath 返回 time） -------
let diffTime = 0; // ms
function nowWithDiff() { return Date.now() - diffTime; }

// ------- 4) axios 实例 -------
const service = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL,
  timeout: 15000,
});

// 统一拼公共参数 + 自定义头
function appendCommonQuery(config: InternalAxiosRequestConfig) {
  var t = nowWithDiff();
  var random = String(t).slice(-8).split('').reverse().join(''); // 老逻辑

  var q = random;
  var p = String(Number(bt0a(random)) ^ (AT0B_CONST ^ 11111)); // == Number(bt0a(random)) ^ 920279
  var lang = (i18n as any)?.language ? (i18n as any).language : 'my';

  var params: Record<string, any> = {};
  var orig = (config.params || {}) as Record<string, any>;
  var k: string;
  for (k in orig) params[k] = orig[k];

  params.q = q;
  params.p = p;
  params.lang = lang;
  params.t = t;

  config.params = params;

  // 自定义头：code = Number(bt0a(random)) * (AT0B_CONST ^ 11111) == * 920279
  var headers = (config.headers = config.headers instanceof AxiosHeaders ? config.headers : new AxiosHeaders(config.headers));
  var code = String(Number(bt0a(random)) * (AT0B_CONST ^ 11111));
  headers.set('code', code);
}

service.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
  // 规范化 headers
  var headers = (config.headers = config.headers instanceof AxiosHeaders ? config.headers : new AxiosHeaders(config.headers));

  // 兼容老后端：用 eliao-token 作为鉴权头（若后端改成 Bearer，再切换为 Authorization 即可）
  try {
    var token = useUserStore.getState().token;
    if (token) {
      headers.set('eliao-token', token);
      // headers.set('Authorization', 'Bearer ' + token);
    }
  } catch {}

  // 追加 q/p/lang/t + code
  appendCommonQuery(config);

  return config;
}, function (error) {
  return Promise.reject(error);
});

service.interceptors.response.use(function (response) {
  var payload = response.data;

  // /nweb/getpath：更新 diffTime（time 为秒级），其余字段直接明文返回
  if (response.config && response.config.url && String(response.config.url).indexOf('/nweb/getpath') !== -1) {
    if (payload && typeof payload.time !== 'undefined') {
      var serverMs = Number(payload.time) * 1000;
      if (!isNaN(serverMs)) diffTime = Date.now() - serverMs;
    }
    return payload; // {domain, banners, sysconfig, gonggao, games, cate, ...}
  }

  // 其它接口：如果是老结构 {status:{errorCode}, data:"<加密串>"} 且成功，则解密 data
  if (payload && payload.status && typeof payload.status.errorCode !== 'undefined') {
    var errorCode = Number(payload.status.errorCode);

    // Check for token expiration (errorCode 400)
    if (errorCode === 400) {
      // Extract error message
      var errorMsg = payload.status.mess || payload.status.msg || 'Session expired. Please login again.';

      // Clear user token and info from store
      try {
        useUserStore.getState().logout();
      } catch (err) {
        console.error('Error during logout:', err);
      }

      // Show alert to user and redirect after closing
      showAlert(errorMsg, () => {
        window.location.href = '/login';
      });

      // Reject the promise to prevent further processing
      return Promise.reject(new Error(errorMsg));
    }

    var ok = errorCode === 0;
    if (ok && typeof payload.data === 'string') {
      try { payload.data = aesDecryptToJson(payload.data); } catch {}
    }
    return payload;
  }

  return payload;
}, function (error) {
  return Promise.reject(error);
});

export default service;
