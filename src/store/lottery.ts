import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LotteryGameType = 'L2D' | 'L3D';

interface BetSessionData {
  issue: string;
  win_time: string;
  set: string;
  value: string;
  win_num: string;
  winState?: number; // 1 = pending, 3 = completed
}

interface UserInfoData {
  userName?: string;
  balance?: number;
  freeze?: number;
  back_url?: string;
  [key: string]: any;
}

interface ClosedDay {
  type: 1 | 2; // 1 = day of week, 2 = specific date
  day?: number; // For type 1: 1-7 (Monday-Sunday)
  date?: string; // For type 2: YYYY-MM-DD
  remark?: string;
}

interface LotterySessionState {
  // Login credentials for lottery backend
  lotteryToken: string;
  lotteryDomain: string;
  gameType: LotteryGameType | null;

  // User info
  userInfo: UserInfoData;

  // 2D Game data
  pendingSessions: BetSessionData[]; // winState = 1
  completedSessions: BetSessionData[]; // winState = 3
  currentSession: any; // BetSession type - using any to avoid import issues
  selectedIssue: string | null;
  
  // System data
  closedDays: ClosedDay[];
  betCloseTime: string | null;
  availableBetNumbers: number[];
  
  // Loading states
  isLoadingUserInfo: boolean;
  isLoadingSessions: boolean;
  error: string | null;

  // Actions
  setLotteryCredentials: (token: string, domain: string, gameType: LotteryGameType) => void;
  setUserInfo: (info: UserInfoData) => void;
  setPendingSessions: (sessions: BetSessionData[]) => void;
  setCompletedSessions: (sessions: BetSessionData[]) => void;
  setCurrentSession: (session: any) => void;
  setSelectedIssue: (issue: string | null) => void;
  setClosedDays: (days: ClosedDay[]) => void;
  setBetCloseTime: (time: string | null) => void;
  setAvailableBetNumbers: (numbers: number[]) => void;
  setLoadingUserInfo: (loading: boolean) => void;
  setLoadingSessions: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearLotterySession: () => void;
}

export const useLotteryStore = create<LotterySessionState>()(
  persist(
    function (set) {
      return {
        lotteryToken: '',
        lotteryDomain: '',
        gameType: null,
        userInfo: {},
        pendingSessions: [],
        completedSessions: [],
        currentSession: null,
        selectedIssue: null,
        closedDays: [],
        betCloseTime: null,
        availableBetNumbers: [],
        isLoadingUserInfo: false,
        isLoadingSessions: false,
        error: null,

        setLotteryCredentials: function (token: string, domain: string, gameType: LotteryGameType) {
          set({ lotteryToken: token, lotteryDomain: domain, gameType });
        },

        setUserInfo: function (info: UserInfoData) {
          set((state) => ({
            userInfo: { ...state.userInfo, ...info },
          }));
        },

        setPendingSessions: function (sessions: BetSessionData[]) {
          set({ pendingSessions: sessions });
        },

        setCompletedSessions: function (sessions: BetSessionData[]) {
          set({ completedSessions: sessions });
        },

        setCurrentSession: function (session: any) {
          set({ currentSession: session });
        },

        setSelectedIssue: function (issue: string | null) {
          set({ selectedIssue: issue });
        },

        setClosedDays: function (days: ClosedDay[]) {
          set({ closedDays: days });
        },

        setBetCloseTime: function (time: string | null) {
          set({ betCloseTime: time });
        },

        setAvailableBetNumbers: function (numbers: number[]) {
          set({ availableBetNumbers: numbers });
        },

        setLoadingUserInfo: function (loading: boolean) {
          set({ isLoadingUserInfo: loading });
        },

        setLoadingSessions: function (loading: boolean) {
          set({ isLoadingSessions: loading });
        },

        setError: function (error: string | null) {
          set({ error });
        },

        clearLotterySession: function () {
          set({
            lotteryToken: '',
            lotteryDomain: '',
            gameType: null,
            userInfo: {},
            pendingSessions: [],
            completedSessions: [],
            currentSession: null,
            selectedIssue: null,
            closedDays: [],
            betCloseTime: null,
            availableBetNumbers: [],
            isLoadingUserInfo: false,
            isLoadingSessions: false,
            error: null,
          });
        },
      };
    },
    {
      name: 'lottery-store',
      partialize: function (state: LotterySessionState) {
        // Only persist credentials and game type; session data refreshes on load
        return {
          lotteryToken: state.lotteryToken,
          lotteryDomain: state.lotteryDomain,
          gameType: state.gameType,
        };
      },
    }
  )
);
