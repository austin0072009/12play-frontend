// src/services/auth.ts
import { postData } from "./http";
import type {
    LoginReq,
    LoginResp,
    SendOtpRegisterReq,
    SendOtpRegisterResp,
    VerifyOtpResp,
    RegisterReq,
    RegisterResp,
    SendOtpResp,
    ResetPwdReq
} from "./types";

export function loginApi(payload: LoginReq) {
    return postData<LoginResp>(
        "/nweb/login",
        {},
        { params: { name: payload.name, password: payload.password } }
    );
}

// POST /nweb/send-otp-register
export function sendOtpRegisterApi(payload: SendOtpRegisterReq) {
    return postData<SendOtpRegisterResp>('/nweb/send-otp-register', payload);
}

// 2) 校验 OTP
// POST /nweb/verify-otp
export function verifyOtpApi(payload: any) {
    return postData<VerifyOtpResp>('/nweb/verify-otp', payload);
}

// 3) 注册
// POST /nweb/register
export function registerApi(payload: RegisterReq) {
    return postData<RegisterResp>('/nweb/register', payload);
}

//Only send otp

export function sendOtp(payload: any) {
    return postData<SendOtpResp>('/nweb/send-otp', payload);
}

export function resetPassword(payload: ResetPwdReq) {
    return postData<any>('/nweb/reset_pass', payload);
}
