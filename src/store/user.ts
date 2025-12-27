import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  token: string | null;
  userInfo: any;
  setToken: (token: string) => void;
  setUserInfo: (info: any) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: {},
      setToken: (token) => set({ token }),
      setUserInfo: (info) => set({ userInfo: info }),
      logout: () => set({ token: null, userInfo: {} }),
    }),
    {
      name: 'user-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ token: s.token, userInfo: s.userInfo }),
    }
  )
);
