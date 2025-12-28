// store/app.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Meta = { theme?: string; logo?: string; url?: string };
type AppData = {
    domain?: string;
    banners?: any[];
    notices?: any[];
    games?: any[];
    sysconfig?: Record<string, any>;
    contacts?: any[];
    serviceList?: Record<string, any>; // ✅ 改成对象
    cate?: any[];
    tj_games?: any[]; // Recommended games
    hot_games?: any[]; // Popular games
    special_games?: any[]; // Special games (权威认证)
};

interface AppState {
    meta: Meta;
    data: AppData;
    setMeta: (m: Partial<Meta>) => void;
    setData: (d: Partial<AppData>) => void;
    reset: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            meta: {},
            data: {},
            setMeta: (m) =>
                set((s) => ({ meta: { ...s.meta, ...m } })),
            setData: (d) =>
                set((s) => ({ data: { ...s.data, ...d } })),
            reset: () => set({ meta: {}, data: {} }),
        }),
        {
            name: "app-store", // localStorage key
            version: 1,
            storage: createJSONStorage(() => localStorage),
            // 只持久化 meta/data（含 domain）
            partialize: (s) => ({ meta: s.meta, data: s.data }),
        }
    )
);
