export type GetPathResp = {
  status: { errorCode: number; msg?: string; mess?: string };
  data: string; // 例如 "theme1"
  logo?: string;
  url?: string;
};

export type InitDataResp = {
  domain?: string;
  banners?: any[];
  sysconfig?: Record<string, any>;
  gonggao?: any[];
  games?: any[];
  cate?: any[];
  tj_games?: any[];
};

// src/services/types.ts 追加/更新
export type LoginReq = {
  name: string;
  password: string;
  remember?: boolean;
};

export type LoginData = {
  token: string;
  member: Record<string, any>;
  yzflag: boolean; // 可能表示是否已验证
  qk_pwd: boolean; // 是否设置了取款密码
};

export type LoginResp = {
  status: { errorCode: number; msg?: string; mess?: string };
  data: LoginData | ""; // 失败时是空串
  url?: string;
};

// 发送注册 OTP
export type SendOtpRegisterReq = {
  // 二选一：email 或 phone
  email?: string;
  phone?: string;
  type: "email" | "phone"; // 和你的后端一致
};
export type SendOtpRegisterResp = {
  status: { errorCode: number; msg?: string; mess?: string };
  data: any; // 拦截器会解密后返回，这里一般无需使用
  url?: string;
};

export type SendOtpReq = {
  // 二选一：email 或 phone
  email?: string;
  phone?: string;
  type: "email" | "phone"; // 和你的后端一致
};

export type SendOtpResp = {
  status: { errorCode: number; msg?: string; mess?: string };
  data: any; // 拦截器会解密后返回，这里一般无需使用
  url?: string;
};

// 校验 OTP
export type VerifyOtpReq = {
  phone?: string;
  email?: string;
  type: "email" | "phone";
  otp: string;
};
export type VerifyOtpResp = {
  status: { errorCode: number; msg?: string; mess?: string };
  data: any;
  url?: string;
};

//重设密码
export type ResetPwdReq = {
  mobile?: string;
  email?: string;
  type: "email" | "phone";
  otp?: string;
  old_password: string;
  password: string;
};

// 注册
export type RegisterReq = {
  mobile?: string;
  email?: string;
  type?: "email" | "phone";
  password: string;
  captcha?: string;
  otp?: string; // OTP 验证码
  // 新增：邀请码（可选）
  yqm?: string;

  // t_name?: string;

  // 可选：用户名（后端不需要会忽略）
  name?: string;
};

export type RegisterResp = {
  status: { errorCode: number; msg?: string; mess?: string };
  data: any; // 解密后对象或空串（失败时）
  url?: string;
};

// 请求体（后端要求把 token 放到 body，同时我们也会带请求头）
export type KyGetGamesReq = {
  productCode: string; // 品牌，如 'KINGMAKER' | 'PG' ...
  cateflag: string; // 分类，如 'slot' | 'live' | ...
  token?: string; // 由前端注入
};

// Ky_getgames 返回的单个游戏条目
export type KyGameItem = {
  id: number;
  gameName: string;
  gameType?: string; // 文本型
  game_type?: number; // 数字型
  game_code?: string;
  m_img?: string;
  img?: string;
  ios_outer?: number;
  category?: number;
};

type ApiStatus = { errorCode: number; msg?: string; mess?: string };
type Maintain = { status: boolean; [k: string]: any };

export type KyGetGamesResponse = {
  status: ApiStatus;
  data: { data: KyGameItem[]; maintain?: Maintain };
};

// KY 登录请求
export type KyLoginReq = {
  token: string; // 登录 token
  plat_type: string; // 平台标识，如 'l2d'
  game_type: number; // 游戏类型，例如 1
  devices: number; // 设备类型，例如 1 表示 H5
  id: number; // 游戏 ID
  game_code?: string; // 可选，游戏代码
  tgp?: string; // 可选，附加参数
};

// KY 登录响应（待补充 data 结构）
export type KyLoginResp = {
  status: { errorCode: number; msg?: string; mess?: string };
  data: any; // 等你给我后端返回的字段我再细化
  url?: string;
};

// 活动页面请求

export type GetActivityReq = {
  page: number; // 页码
  pageSize: number; // 每页条数
  token?: string; // 可选，用户 token
};

export type ActivityItem = {
  flag: string;
  id: number;
  title: string;
  title_img_wap: string;
  type: number;
  update: string;
};
export type GetActivityResp = {
  status: ApiStatus;
  data: {
    list: ActivityItem[];
    types: [];
  };
  url?: string;
};

//活动页面详细信息请求

export type GetActivityDetailReq = {
  id: number; // 活动 ID
  token?: string; // 可选，用户 token
};

export type GetActivityDetailResp = {
  status: ApiStatus;
  data: ActivityDetail;
  url?: string;
};

export type ActivityDetail = {
  id: number;
  activity_api: string;
  activity_cate: string;
  activity_game: number;
  activity_notgame: string | null;
  button: string | null;
  content: string | null;
  created_at: string; // 时间戳/ISO 字符串
  date_desc: string;
  end_at: string;
  flag: string;
  flex_type: string | null;
  gift_limit_money: number | null;
  is_apply: number;
  is_gd: number;
  is_hot: number;
  money: number | null;
  on_line: number;
  rate: number | null;
  rule_content: string | null;
  sort: number;
  start_at: string;
  subtitle: string | null;
  title: string;
  title_content: string; // HTML 字符串
  title_img: string;
  title_img_wap: string;
  type: number;
  updated_at: string;
};

export type BankInfo = {
  bank_card: string;
  bank_name: string;
  bank_username: string;
  draw_limit_money: string;
  draw_rate: string;
  draw_times: 20;
  isset_pass: number;
  limit_end: string;
  limit_start: string;
  today_draw_money: number;
  today_draw_times: number;
  turnover: string;
};

export type GetBankListResp = {
  status: ApiStatus;
  data: BankInfo;
  url?: string;
};

export type AddBankReq = {
  type: number;
  bank_name: string;
  bank_branch_name: string;
  bank_username: string;
  bank_card: string;
  qr_code?: File;
  pageCome?: string;
};

export type AddBankResp = {
  status: ApiStatus;
  data: any;
  url?: string;
};

export type BankItem = {
  name: string; // 展示名
  img: string; // 展示图
  code: string; // 提交给后端用的 KBZPAY / WAVEPAY
};

export type Bank = {
  id: number;
  image: string;
  name: string;
  type: string; // 也可用 number
  rechargeAmounts: string[];
  minimumAmount: number; // ✅ 统一命名 + number
  rechargeId?: number; // Recharge config ID for payment
};

export type GetRechargeAmountsResp = {
  status: ApiStatus;
  data: any;
  url?: string;
};

export type OrderBuildReq = {
  amount: number;
  payer_name: string;
  recharge_id: number;
  recharge_type: number;
};

export type OrderBuildResp = {
  status: ApiStatus;
  data: {
    tid: number; // Order ID
    order_type: number; // 0=self-service, 1=third-party (needs redirect)
  };
  url?: string;
};

// Payment redirect request (for third-party payments like BCATPAY)
export type BwPayReq = {
  order_id: number; // The tid from orderbuild
  recharge_id: number; // The recharge config ID
};

export type BwPayResp = {
  status: ApiStatus;
  data: {
    is_out: number; // 1=redirect externally
    pay_url: string; // URL to redirect user to for payment
    status: number; // 1=success
    msg: string;
    order_no: string; // Order number (bill_no)
    platform_order_no?: string; // Platform order number
    account_number?: string; // Optional account info
    account_name?: string; // Optional account info
  };
  url?: string;
};

export type SubmitTime = {
  date: string;
  timezone: string;
  timezone_type: number;
};

export type GatheringOrderInfo = {
  orderNo: string;
  orderState: number;
  accountHolder: string;
  bankCardAccount: string;
  gatheringAmount: number;
  gatheringChannelCode: string;
  gatheringChannelName: string;
  id: number;
  openAccountBank: string;
  returnUrl: string;
  submitTime: SubmitTime;
  usefulTime: string;
};

export type GetActionLogReq = {
  end_at?: string;
  page?: number;
  row?: number;
  start_at?: string;
  type: number;
};

export type ActionLogItem = {
  bill_no: string;
  created_at: string;
  money: string;
  payer_name: string; // at here payer_name is the 6 digit tailNumber
  status: number;
  payment_type: number;
  account?: string; // Payment account (KBZPAY, WAVEPAY, etc.)
  bank_card?: string;
  bank_name?: string;
  fail_reason?: string;
};

// Wallet Balance Response
export type WalletBalanceData = {
  balance: number;
  ml_money: number; // Turnover amount
};

export type WalletBalanceResp = {
  status: ApiStatus;
  data: WalletBalanceData;
  url?: string;
};

// ================== LOTTERY 2D/3D API TYPES ==================

/** Exchange ticket for lottery token */
export type LotteryExchangeReq = {
  ticket: string;
};

export type LotteryExchangeResp = {
  code: number;
  message: string;
  data: {
    token: string;
  };
};

/** Game List Response */
export type LotteryGameListResp = {
  code: number;
  message: string;
  data: Array<{
    gameId: number;
    gameName: string;
  }>;
};

/** 2D Live Result */
export type Lottery2DLiveResp = {
  set: string;
  value: string;
  win_num: string;
};

/** User Info */
export type LotteryUserInfoResp = {
  code: number;
  message: string;
  data: {
    userName: string;
    balance: string;
    freeze: string;
    back_url: string;
  };
};

/** Game Resource (Banner & Notifications) */
export type LotteryGameResourceReq = {
  gameId: number;
};

export type LotteryGameResourceResp = {
  code: number;
  message: string;
  data: {
    banners: Array<{
      id: number;
      image: string;
      title: string;
    }>;
    notifications: Array<{
      id: number;
      message: string;
    }>;
  };
};

/** Bet Session */
export type BetSession = {
  issue: string;
  win_time: string;
  bet_close: number;
  bet_state: number;
  set: string;
  value: string;
  win_num: string;
  winState: number; // 1: Pending, 3: Completed
  created_at: string;
  updated_at: string;
};

export type LotteryBetSessionResp = {
  code: number;
  message: string;
  data: BetSession[];
};

/** Available Bet Numbers for a Session */
export type LotterySessionNumberReq = {
  issue: string;
  gameId: number;
};

export type SessionNumber = {
  num: string;
  max_amount: string;
  min_bet: string;
  max_bet: string;
  odds: number;
  time_range: string | null;
  max_bet_limit: string | null;
  bet_placed: number;
};

export type LotterySessionNumberResp = {
  code: number;
  message: string;
  data: SessionNumber[];
};

/** Place Bet */
export type BetInfo = {
  number: string;
  amount: number;
};

export type LotteryBetReq = {
  gameId: number;
  issue: string;
  betInfo: BetInfo[];
};

export type LotteryBetResp = {
  code: number;
  message: string;
  data: {
    betId: string;
    status: string;
  };
};

/** Win Ranking for a Session */
export type LotteryRankReq = {
  gameId: number; // 1 for 2D, 2 for 3D
  issue: string;
};

export type LotteryRankRespItem = {
  user_id: number;
  betAmount: number;
  winAmount: number;
  phone: string;
  nickname: string;
};

export type LotteryRankResp = {
  code: number;
  message: string;
  data: LotteryRankRespItem[];
};

/** User Bet Statistics per Session */
export type LotteryBetListReq = {
  issueId: string;
  page?: number;
  pageSize?: number;
};

export type LotteryBetListResp = {
  code: number;
  message: string;
  data: {
    totalBet: number;
    betCount: number;
  };
};

/** Bet Records */
export type LotteryBetRecordReq = {
  gameId: number; // 1 for 2D, 2 for 3D
  issue?: string; // empty string to fetch all issues
  page?: number;
  pageSize?: number;
};

export type BetRecord = {
  id: number;
  issue: string;
  username: string;
  bet_number: string;
  bet_amount: string;
  is_win: number | null;
  is_lottery: number;
  award: string | null;
  net_bet: string | null;
  created_at: string;
  updated_at: string;
  game_name: string;
};

export type LotteryBetRecordResp = {
  code: number;
  message: string;
  data: BetRecord[];
};

/** Daily Bet Statistics */
export type LotteryRecordTotalReq = {
  date: string; // YYYY-MM-DD
};

export type LotteryRecordTotalResp = {
  code: number;
  message: string;
  data: {
    date: string;
    totalBet: number;
    totalWin: number;
  };
};

/** Specific Date Bet Details */
export type LotteryBetDetailsReq = {
  date: string; // YYYY-MM-DD
  page?: number;
  pageSize?: number;
};

export type LotteryBetDetailsResp = {
  code: number;
  message: string;
  data: {
    details: BetRecord[];
    total: number;
  };
};

/** Specific Date Bet Total by Session */
export type LotteryIssueTotalReq = {
  date: string; // YYYY-MM-DD
};

export type LotteryIssueTotal = {
  issueId: string;
  issueNumber: string;
  totalBet: number;
  totalWin: number;
};

export type LotteryIssueTotalResp = {
  code: number;
  message: string;
  data: {
    totals: LotteryIssueTotal[];
  };
};
/** Closed/Rest Days */
export type LotteryClosedDayReq = {
  gameId: number; // 1 for 2D, 2 for 3D
};

export type ClosedDay = {
  type: 1 | 2; // 1 = day of week, 2 = specific date
  day?: number; // For type 1: 1-7 (Monday-Sunday)
  date?: string; // For type 2: YYYY-MM-DD
  remark?: string;
};

export type LotteryClosedDayResp = {
  code: number;
  message: string;
  data: ClosedDay[];
};

// Recent Games API
export type RecentGameItem = {
  id: number;
  gameType: string;
  gameName: string;
  tcgGameCode: string;
  productCode: string;
  productType: number;
  img: string;
  m_img: string;
  is_outopen: number;
  is_ios_outopen: number;
  category: string;
};

export type RecentGamesResp = {
  status: number;
  data: RecentGameItem[];
  msg: string;
};
