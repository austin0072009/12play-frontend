import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  token: string | null;
  userInfo: any;
  isInLotteryWallet: boolean;
  setToken: (token: string) => void;
  setUserInfo: (info: any) => void;
  setIsInLotteryWallet: (flag: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: {},
      isInLotteryWallet: false,
      setToken: (token) => set({ token }),
      setUserInfo: (info) => set({ userInfo: info }),
      setIsInLotteryWallet: (flag) => set({ isInLotteryWallet: flag }),
      logout: () => {
        // Clear auth-related localStorage items
        // Note: Keep "remember-account" so username stays pre-filled on login page
        localStorage.removeItem("RedCow-token-expiration");
        localStorage.removeItem("RedCow-username");
        localStorage.removeItem("RedCow-password");

        // Clear lottery store
        localStorage.removeItem("lottery-store");

        // Clear GA4 first deposit tracking (so new user can trigger it)
        localStorage.removeItem("ga4_first_deposit_tracked");

        set({ token: null, userInfo: {}, isInLotteryWallet: false });
      },
    }),
    {
      name: 'user-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ token: s.token, userInfo: s.userInfo, isInLotteryWallet: s.isInLotteryWallet }),
    }
  )
);
