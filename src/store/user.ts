import { create } from 'zustand';

interface UserState {
  token: string | null;
  userInfo: any;
  setToken: (token: string) => void;
  setUserInfo: (info: any) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  userInfo: {},
  setToken: (token) => set({ token }),
  setUserInfo: (info) => set({ userInfo: info }),
  logout: () => set({ token: null, userInfo: {} }),
}));
