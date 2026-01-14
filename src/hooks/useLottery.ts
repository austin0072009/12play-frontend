import { useState, useCallback } from 'react';
import * as lotteryAPI from '../services/lottery';
import type { BetSession } from '../services/types';

/**
 * Hook for loading and managing bet sessions
 */
export function useBetSessions() {
  const [sessions, setSessions] = useState<BetSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const load = useCallback(async (gameId: number, winState: number) => {
    try {
      setLoading(true);
      setError('');
      const data = await lotteryAPI.getBetSessions(gameId, winState);
      setSessions(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load sessions';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPendingSessions = useCallback(() => {
    return sessions.filter(s => s.winState === 1);
  }, [sessions]);

  const getCompletedSessions = useCallback(() => {
    return sessions.filter(s => s.winState === 3);
  }, [sessions]);

  return { sessions, loading, error, load, getPendingSessions, getCompletedSessions };
}

/**
 * Hook for 2D live result
 */
export function use2DLiveResult() {
  const [result, setResult] = useState<string>('--');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await lotteryAPI.get2DLiveResult();
      if (data.win_num) {
        setResult(data.win_num);
        setLastUpdated('');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load result';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, lastUpdated, loading, error, load };
}

/**
 * Hook for user lottery info
 */
export function useLotteryUserInfo() {
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await lotteryAPI.getLotteryUserInfo();
      setBalance(parseFloat(data.balance));
      setUsername(data.userName);
      setUserId(0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load user info';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { balance, username, userId, loading, error, load };
}

/**
 * Hook for placing bets
 */
export function usePlaceBet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const place = useCallback(
    async (issueId: string, number: string, amount: number, gameId: number) => {
      try {
        setLoading(true);
        setError('');
        setSuccess(false);
        
        const result = await lotteryAPI.placeBet({
          gameId,
          issue: issueId,
          betInfo: [{ number, amount }],
        });
        
        setSuccess(true);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to place bet';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { place, loading, error, success };
}

/**
 * Hook for session numbers
 */
export function useSessionNumbers(issueId: string | null) {
  const [numbers, setNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const load = useCallback(async () => {
    if (!issueId) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await lotteryAPI.getSessionNumbers(issueId, 1);
      setNumbers(data.map(n => n.num) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load numbers';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  return { numbers, loading, error, load };
}

/**
 * Hook for bet records/history
 */
export function useBetRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const load = useCallback(async (gameId: number, issue?: string, page?: number, pageSize?: number) => {
    try {
      setLoading(true);
      setError('');
      const data = await lotteryAPI.getBetRecords(gameId, issue ?? '', page, pageSize);
      setRecords(data || []);
      setTotal((data || []).length);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load bet records';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { records, total, loading, error, load };
}

/**
 * Hook for win ranking
 */
export function useWinRanking(issueId: string | null) {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const load = useCallback(async () => {
    if (!issueId) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await lotteryAPI.getWinRanking(1, issueId);
      setRanking(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load ranking';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  return { ranking, loading, error, load };
}

/**
 * Hook for daily bet statistics
 */
export function useDailyBetTotal(date: string | null) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const load = useCallback(async () => {
    if (!date) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await lotteryAPI.getDailyBetTotal(date);
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load daily stats';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [date]);

  return { stats, loading, error, load };
}

/**
 * Hook for game list
 */
export function useGameList() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await lotteryAPI.getGameList();
      setGames(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load games';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { games, loading, error, load };
}

/**
 * Hook for game resources (banners, notifications)
 */
export function useGameResource(gameId: number | null) {
  const [banners, setBanners] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const load = useCallback(async () => {
    if (!gameId) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await lotteryAPI.getGameResource(gameId);
      setBanners(data.banners || []);
      setNotifications(data.notifications || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load resources';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  return { banners, notifications, loading, error, load };
}
