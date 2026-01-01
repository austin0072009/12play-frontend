import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { showAlert } from '../store/alert';

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

// Response interceptor: Handle errors including token expiration
lotteryRequest.interceptors.response.use(
  function (response) {
    const payload = response.data;

    // Check for authentication errors (401 Unauthorized or specific error codes)
    if (payload && typeof payload.code !== 'undefined') {
      const code = Number(payload.code);

      // Handle unauthorized/token expired errors
      // Common HTTP status codes: 401 (Unauthorized), 403 (Forbidden)
      // Or check for specific error codes from lottery API
      if (code === 401 || code === 403 || response.status === 401) {
        const errorMsg = payload.message || 'Session expired. Please login again.';

        // Clear lottery token
        clearLotteryToken();

        // Show alert and redirect after closing
        showAlert(errorMsg, () => {
          window.location.href = '/login';
        });

        return Promise.reject(new Error(errorMsg));
      }
    }

    return payload;
  },
  function (error: any) {
    // Handle HTTP-level errors (network errors, 401, 403, etc.)
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      const errorMsg = error.response?.data?.message || 'Session expired. Please login again.';

      clearLotteryToken();

      // Show alert and redirect after closing
      showAlert(errorMsg, () => {
        window.location.href = '/login';
      });

      return Promise.reject(new Error(errorMsg));
    }

    return Promise.reject(error);
  }
);

export default lotteryRequest;
