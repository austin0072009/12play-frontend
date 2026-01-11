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
        // Clear token expiration on logout
        localStorage.removeItem("RedCow-token-expiration");
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
