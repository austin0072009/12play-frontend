import { getData, postData } from "./http";
import { useUserStore } from "../store/user";

import type {
    GetPathResp,
    InitDataResp,
    GetActivityResp,
    GetActivityDetailResp,
    GetBankListResp,
    AddBankReq,
    AddBankResp,
    GetRechargeAmountsResp,
    OrderBuildReq,
    OrderBuildResp,
    BwPayReq,
    BwPayResp,
    GetActionLogReq,
    WalletBalanceResp,
} from "./types";

// 基础信息（主题/Logo/url）——明文返回
export function fetchInitMeta() {
    return getData<GetPathResp>("/nweb/getpath");
}

// 首页展示数据 —— 兼容 {status,data:{...}} 或直接 {...}
export async function fetchInitData() {
    const res = await getData<
        { status?: any; data?: InitDataResp } | InitDataResp
    >("/nweb/Ky_getAllGameCates");
    //console.log("fetchInitData res=", res);
    return res && (res as any).data
        ? ((res as any).data as InitDataResp)
        : (res as InitDataResp);
}

export async function fetchActivityData() {
    const res = await getData<GetActivityResp>("/nweb/activities");
    return res as GetActivityResp;
}

export async function fetchActivityDetail(id: string) {
    const res = await getData<GetActivityDetailResp>("/nweb/activity_detail", {
        params: { id },
    });
    return res as GetActivityDetailResp;
}

export async function claimActivity(activity_id: number, flex_type: number) {
    const token = useUserStore.getState().token || "";
    const res = await postData<any>("/nweb/post_activity", {
        token,
        activity_id,
        flex_type,
    });
    //console.log("claimActivity res=", res);
    return res as any;
}

export async function fetchLuckWheelInfo() {
    const token = useUserStore.getState().token || "";
    const res = await postData<any>("/nweb/lucky_wheel_info", {
        token,
    });
    return res as any;
}

// 获取注册红包活动信息（包含今日领取人数和领取记录）
export async function fetchGrabRedInfo() {
    const res = await postData<any>("/nweb/grab_red_info");
    return res as any;
}

export async function fetchLotteryRank() {
    const res = await postData<any>("/nweb/lottery_rank");
    return res as any;
}


export async function fetchBankList() {
    const token = useUserStore.getState().token || "";
    const res = await getData<GetBankListResp>("/nweb/get_bind_bank", {
        params: { token },
    });
    return res as GetBankListResp;
}

export async function AddBank(payload: Omit<AddBankReq, "token">) {
    const token = useUserStore.getState().token || "";
    const form = new FormData();
    form.append("token", token);
    form.append("bank_name", payload.bank_name);
    form.append("bank_branch_name", payload.bank_branch_name);
    form.append("bank_username", payload.bank_username);
    form.append("bank_card", payload.bank_card);
    if (payload.qr_code !== undefined) {
        form.append("qr_code", payload.qr_code); // 🔑 binary
    }

    const res = await postData<AddBankResp>("/nweb/bind_bank", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res as any;
}

export async function fetchRecharegeAmount(recharge_type: string) {
    const token = useUserStore.getState().token || "";
    const res = await postData<GetRechargeAmountsResp>("/nweb/recharge_cate", {
        recharge_type,
        token,
    });
    //console.log("fetchRecharegeAmount res=", res);
    return res as GetRechargeAmountsResp;
}

export async function buildOrder(payload: Omit<OrderBuildReq, "token">) {
    const token = useUserStore.getState().token || "";
    const res = await postData<OrderBuildResp>("/nweb/orderbuild", { ...payload, token });
    return res as OrderBuildResp;
}

export async function initiatePayment(payload: Omit<BwPayReq, "token">) {
    const token = useUserStore.getState().token || "";
    const res = await postData<BwPayResp>("/nweb/bwpay", { ...payload, token });
    return res as BwPayResp;
}

export async function fetchOrderStatus(orderId: number) {
    const res = await getData<any>("/nweb/getorder", {
        params: { orderNo: orderId },
    });
    return res as any;
}

export async function payOrder(orderId: number, payerName: string) {
    const res = await getData<any>("nweb/surepay", {
        params: { orderNo: orderId, payerName },
    });
    return res as any;
}

export async function fetchActionLog(payload: Omit<GetActionLogReq, "token">) {
    const token = useUserStore.getState().token || "";
    const res = await postData<any>("/nweb/actionlog", {
        ...payload,
        token,
    });

    return res as any;
}

export async function fetchBalance(token?: string) {
    const finalToken = token || useUserStore.getState().token || "";
    const res = await getData<WalletBalanceResp>("/nweb/wallet_balance", { params: { token: finalToken } });

    return res as WalletBalanceResp;
}

export async function withdrawal(money: number, type: string) {
    const token = useUserStore.getState().token || "";

    const res = await postData<any>("/nweb/drawing", {
        token,
        money,
        type,
        qk_pwd: "1",
    });
    //console.log("withdrawalResp=", res);

    return res as any;
}

export async function unBindCard() {
    const token = useUserStore.getState().token || "";

    const res = await postData<any>("/nweb/unbind_bank", {
        token,
    });

    return res as any;
}

export async function fetchDepositBonusInfo() {
    const token = useUserStore.getState().token || "";

    const res = await postData<any>("/nweb/getDepositBonusInfo", {
        token,
    });
    return res as any;
}

export async function fetchCheckinInfo() {
    const token = useUserStore.getState().token || "";

    const res = await postData<any>("/nweb/grabCheckinInfo", {
        token,
    });
    return res as any;
}

export async function checkinToday() {
    const token = useUserStore.getState().token || "";

    const res = await postData<any>("/nweb/checkinToday", {
        token,
    });
    return res as any;
}


export async function transferOut() {

    const token = useUserStore.getState().token || "";
    const res = await postData<any>("/nweb/Ky_transferout", {
        token,
    });

    return res as any;
}

export async function postFeedback(data: { type: string; content: string; phone: string }) {
    const token = useUserStore.getState().token || "";
    const res = await postData<any>("/nweb/feedback", {
        token,
        ...data,
    });
    return res as any;
}
