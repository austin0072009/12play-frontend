import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

// Get lottery API base URL from env or fallback
const LOTTERY_BASE_URL = (import.meta as any).env?.VITE_LOTTERY_API_BASE_URL || 'https://game.sea2d3d.com';

const lotteryRequest = axios.create({
  baseURL: LOTTERY_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store lottery token for this session
let lotteryToken: string = '';

/**
 * Set the lottery token (obtained from Ky_login response)
 */
export function setLotteryToken(token: string) {
  lotteryToken = token;
}

/**
 * Get the current lottery token
 */
export function getLotteryToken(): string {
  return lotteryToken;
}

/**
 * Clear the lottery token (on logout)
 */
export function clearLotteryToken() {
  lotteryToken = '';
}

// Request interceptor: Add Authorization header
lotteryRequest.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    const headers = (config.headers = config.headers instanceof AxiosHeaders 
      ? config.headers 
      : new AxiosHeaders(config.headers));
    
    // Add token directly (lottery API doesn't use Bearer prefix)
    if (lotteryToken) {
      headers.set('Authorization', lotteryToken);
    }
    
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors
// lotteryRequest.interceptors.response.use(
//   function (response: AxiosResponse) {
//     return response.data;
//   },
//   function (error: any) {
//     // Parse error response
//     const errorMsg = error.response?.data?.message || error.message || 'Request failed';
//     const errorCode = error.response?.status || error.code;
    
//     const err = new Error(errorMsg) as any;
//     err.code = errorCode;
//     err.response = error.response?.data;
    
//     return Promise.reject(err);
//   }
// );

export default lotteryRequest;
