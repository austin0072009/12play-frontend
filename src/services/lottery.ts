import lotteryRequest from '../utils/lotteryRequest';
import type {
  LotteryGameListResp,
  Lottery2DLiveResp,
  LotteryUserInfoResp,
  LotteryGameResourceReq,
  LotteryGameResourceResp,
  LotteryBetSessionResp,
  LotterySessionNumberReq,
  LotterySessionNumberResp,
  LotteryBetReq,
  LotteryBetResp,
  LotteryRankReq,
  LotteryRankResp,
  LotteryBetListReq,
  LotteryBetListResp,
  LotteryBetRecordReq,
  LotteryBetRecordResp,
  LotteryRecordTotalReq,
  LotteryRecordTotalResp,
  LotteryBetDetailsReq,
  LotteryBetDetailsResp,
  LotteryIssueTotalReq,
  LotteryIssueTotalResp,
  LotteryClosedDayReq,
  LotteryClosedDayResp,
} from './types';

/**
 * Get game list (all games available)
 */
export async function getGameList(): Promise<LotteryGameListResp['data']> {
  const res = await lotteryRequest.post<LotteryGameListResp>('/api/v3/game/list', {});

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get game list');
  }

  return res.data.data;
}

/**
 * Get 2D live result
 */
export async function get2DLiveResult(): Promise<Lottery2DLiveResp> {
  const res = await lotteryRequest.get<Lottery2DLiveResp>('/api/v1/2d/result');


  return res.data;
}

/**
 * Get user info from lottery backend
 */
export async function getLotteryUserInfo(): Promise<LotteryUserInfoResp['data']> {
  const res = await lotteryRequest.post<LotteryUserInfoResp>('/api/v3/user/info', {});

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get user info');
  }

  return res.data.data;
}

/**
 * Get game resource (banners and notifications)
 */
export async function getGameResource(gameId: number): Promise<LotteryGameResourceResp['data']> {
  const res = await lotteryRequest.post<LotteryGameResourceResp>(
    '/api/v3/game/resource',
    { gameId } as LotteryGameResourceReq
  );

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get game resource');
  }

  return res.data.data;
}

/**
 * Get bet sessions (pending and completed)
 * @param gameId 1 for 2D, 2 for 3D
 * @param winState 1 for pending, 3 for completed/drawn
 */
export async function getBetSessions(gameId: number, winState: number): Promise<LotteryBetSessionResp['data']> {
  const res = await lotteryRequest.post<LotteryBetSessionResp>(
    '/api/v3/history/session',
    { gameId, winState }
  );

  console.log('Bet sessions response:', res);
  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get bet sessions');
  }

  return res.data.data;
}

/**
 * Get available bet numbers for a specific session
 */
export async function getSessionNumbers(issue: string, gameId: number): Promise<LotterySessionNumberResp['data']> {
  const res = await lotteryRequest.post<LotterySessionNumberResp>(
    '/api/v3/session/number',
    { issue, gameId } as LotterySessionNumberReq
  );

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get session numbers');
  }

  return res.data.data;
}

/**
 * Place a bet
 */
export async function placeBet(payload: LotteryBetReq): Promise<LotteryBetResp> {
  const res = await lotteryRequest.post<LotteryBetResp>('/api/v3/bet', payload);

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to place bet');
  }

  return res.data;
}

/**
 * Get win ranking for a session
 */
export async function getWinRanking(gameId: number, issue: string): Promise<LotteryRankResp['data']> {
  const res = await lotteryRequest.post<LotteryRankResp>(
    '/api/v3/rank',
    { gameId, issue } as LotteryRankReq
  );

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get win ranking');
  }

  return res.data.data;
}

/**
 * Get user bet statistics per session
 */
export async function getBetStatistics(
  issueId: string,
  page?: number,
  pageSize?: number
): Promise<LotteryBetListResp['data']> {
  const res = await lotteryRequest.post<LotteryBetListResp>(
    '/api/v3/bet/list',
    { issueId, page, pageSize } as LotteryBetListReq
  );

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get bet statistics');
  }

  return res.data.data;
}

/**
 * Get bet records
 */
export async function getBetRecords(
  gameId: number,
  issue: string = '',
  page: number = 1,
  pageSize: number = 10
): Promise<LotteryBetRecordResp['data']> {
  const res = await lotteryRequest.post<LotteryBetRecordResp>(
    '/api/v3/bet/record',
    { gameId, issue: issue ?? '', page, pageSize } as LotteryBetRecordReq
  );

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get bet records');
  }

  return res.data.data;
}

/**
 * Get daily bet statistics
 */
export async function getDailyBetTotal(date: string): Promise<LotteryRecordTotalResp['data']> {
  const res = await lotteryRequest.post<LotteryRecordTotalResp>(
    '/api/v3/record/total',
    { date } as LotteryRecordTotalReq
  );

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get daily bet total');
  }

  return res.data.data;
}

/**
 * Get specific date bet details
 */
export async function getBetDetails(
  date: string,
  page?: number,
  pageSize?: number
): Promise<LotteryBetDetailsResp['data']> {
  const res = await lotteryRequest.post<LotteryBetDetailsResp>(
    '/api/v3/bet/details',
    { date, page, pageSize } as LotteryBetDetailsReq
  );

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get bet details');
  }

  return res.data.data;
}

/**
 * Get specific date bet total by session
 */
export async function getIssueTotal(date: string): Promise<LotteryIssueTotalResp['data']> {
  const res = await lotteryRequest.post<LotteryIssueTotalResp>(
    '/api/v3/issue/total',
    { date } as LotteryIssueTotalReq
  );

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get issue total');
  }

  return res.data.data;
}

/**
 * Get closed/rest days for a game
 * @param gameId 1 for 2D, 2 for 3D
 */
export async function getClosedDays(gameId: number): Promise<LotteryClosedDayResp['data']> {
  const res = await lotteryRequest.post<LotteryClosedDayResp>(
    '/api/v3/rest/day',
    { gameId } as LotteryClosedDayReq
  );

  if (!res.data || res.data.code !== 200) {
    throw new Error(res.data?.message || 'Failed to get closed days');
  }

  return res.data.data;
}
