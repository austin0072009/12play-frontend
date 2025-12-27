// src/services/games.ts
import request from "../utils/request";
import { useUserStore } from "../store/user";
import type {
  KyGetGamesReq,
  KyGameItem,
  KyGetGamesResponse,
  KyLoginReq,
  KyLoginResp,
} from "./types";

export async function fetchGamesByBrand(
  payload: Omit<KyGetGamesReq, "token">
): Promise<KyGameItem[]> {
  const token = useUserStore.getState().token || "";

  // 明确指定响应类型，保证结构固定
  const res = await request.post<KyGetGamesResponse>("/nweb/Ky_getgames", {
    productCode: payload.productCode,
    cateflag: payload.cateflag,
    token, // 后端要求 token 放 body
  });

  // 严格校验固定结构
  if (!res || typeof res !== "object") {
    throw new Error("响应为空或格式不正确");
  }

  const status = (res as any).status;
  if (!status || typeof status.errorCode !== "number") {
    throw new Error("缺少 status.errorCode");
  }
  if (status.errorCode !== 0) {
    throw new Error(status.mess || "接口返回错误");
  }

  const pack = (res as any).data;
  if (!pack || typeof pack !== "object" || !Array.isArray(pack.data)) {
    throw new Error("缺少 data.data 列表");
  }

  // 维护状态（若后端会给）则直接抛错，交由上层提示
  if (typeof pack.maintain === "object" && pack.maintain !== null) {
    if ((pack.maintain as any).status === true) {
      throw new Error("当前品牌处于维护中，请稍后再试");
    }
  }

  return pack.data as KyGameItem[];
}

/** 发起 KY 登录并返回启动链接 */
export async function startGame(
  payload: Omit<KyLoginReq, "token">
): Promise<string> {
  const tokenFromStore = useUserStore.getState().token || "";
  if (!tokenFromStore) {
    throw new Error("未登录或 token 缺失");
  }

  // 明确展开，避免把多余字段带给后端
  const body: KyLoginReq = {
    token: tokenFromStore,
    plat_type: payload.plat_type,
    game_type: payload.game_type,
    devices: payload.devices,
    id: payload.id,
    game_code: payload.game_code,
    tgp: payload.tgp,
  };

  const res = await request.post<KyLoginResp>("/nweb/Ky_login", body);

  if (!res || typeof res !== "object") {
    throw new Error("响应为空或格式不正确");
  }

  const status = (res as any).status;
  if (!status || typeof status.errorCode !== "number") {
    throw new Error("缺少 status.errorCode");
  }
  if (status.errorCode !== 0) {
    const message =
      (status as any).mess && typeof (status as any).mess === "string"
        ? (status as any).mess
        : status.msg && typeof status.msg === "string"
        ? status.msg
        : "接口返回错误";
    throw new Error(message);
  }

  const gameUrl = (res as any).data;
  if (!gameUrl) {
    throw new Error("缺少游戏启动链接 :" + gameUrl);
  }

  return gameUrl;
}
