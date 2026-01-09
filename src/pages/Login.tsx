// src/pages/Login.tsx
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { InformationCircleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useUserStore } from '../store/user';
import { loginApi } from '../services/auth';
import { fetchBalance } from '../services/api';
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { showAlert } from '../store/alert';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const setToken = useUserStore((s) => s.setToken);
  const setUserInfo = useUserStore((s) => s.setUserInfo);

  const REMEMBER_KEY = "remember-account";
  const [username, setUsername] = useState<string>(() => {
    try {
      return localStorage.getItem(REMEMBER_KEY) || "";
    } catch {
      return "";
    }
  });
  const [remember, setRemember] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(REMEMBER_KEY);
    } catch {
      return false;
    }
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!username || !password) {
      setErr(t("login.missingFields"));
      return;
    }
    setSubmitting(true);
    setErr("");
    try {
      if (remember && username) {
        localStorage.setItem(REMEMBER_KEY, username);
        // Also store password for auto-login (encoded for basic security)
        localStorage.setItem("RedCow-username", username);
        localStorage.setItem("RedCow-password", btoa(password)); // Base64 encode
      } else {
        localStorage.removeItem(REMEMBER_KEY);
        localStorage.removeItem("RedCow-username");
        localStorage.removeItem("RedCow-password");
      }
    } catch { }

    try {
      const res = await loginApi({ name: username, password, remember });
      const ok = !!(res && res.status && Number(res.status.errorCode) === 0);

      if (ok && res.data && typeof res.data === "object") {
        const token = String(res.data.token || "");
        const member = res.data.member || {};
        const yzflag = !!res.data.yzflag;
        const qk_pwd = !!res.data.qk_pwd;

        //console.log("=== LOGIN MEMBER DATA ===", member);
        //console.log("=== LOGIN TOKEN ===", token);

        if (!token) {
          setErr(t("login.missingToken"));
          return;
        }

        setToken(token);

        // Store token expiration time (24 hours from now)
        const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        localStorage.setItem("RedCow-token-expiration", String(expirationTime));
        //console.log("=== TOKEN EXPIRATION SET ===", new Date(expirationTime).toISOString());
        let balance = 0;
        let ml_money = 0;
        try {
          const balanceRes = await fetchBalance(token);
          //console.log("=== BALANCE RESPONSE ===", balanceRes);
          if (balanceRes && balanceRes.status && Number(balanceRes.status.errorCode) === 0 && balanceRes.data) {
            balance = balanceRes.data.balance;
            ml_money = balanceRes.data.ml_money;
            //console.log("=== BALANCE VALUE ===", balance);
            //console.log("=== TURNOVER VALUE ===", ml_money);
          }
        } catch (err) {
          console.error("Failed to fetch balance:", err);
        }

        // Set all user info at once (member + balance + ml_money)
        const finalUserInfo = { ...member, yzflag, qk_pwd, balance, ml_money };
        //console.log("=== FINAL USER INFO TO SET ===", finalUserInfo);
        setUserInfo(finalUserInfo);

        let to = "/home";
        if (location?.state?.from) {
          to = location.state.from;
        }
        navigate(to, { replace: true });
      } else {
        const message =
          (res && res.status && (res.status.mess || res.status.msg)) || t("login.failed");
        setErr(String(message));
      }
    } catch {
      setErr(t("login.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t("login.title") || "Login"}</h1>
      </div>

      {err && <div className={styles.error_bar}>{err}</div>}

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {/* Username */}
        <div className={styles.form_div}>
          <input
            type="text"
            className={styles.form_input}
            placeholder={t("login.account") || "Username"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <InformationCircleIcon className={styles.form_icon} />
        </div>

        {/* Password */}
        <div className={styles.form_div}>
          <input
            type={showPassword ? "text" : "password"}
            className={styles.form_input}
            placeholder={t("login.password") || "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {showPassword ? (
            <EyeSlashIcon
              className={styles.password_toggle}
              onClick={() => setShowPassword((v) => !v)}
            />
          ) : (
            <EyeIcon
              className={styles.password_toggle}
              onClick={() => setShowPassword((v) => !v)}
            />
          )}
        </div>

        {/* Remember Me */}
        <div className={styles.form_check}>
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="remember">{t("login.remember") || "Remember me"}</label>
        </div>

        <div className={styles.form_submit}>
          <button
            className={styles.form_submit_btn}
            type="submit"
            disabled={submitting}
          >
            {submitting ? t("login.submitting") : t("login.submit") || "Login"}
          </button>
        </div>
      </form>

      <div className={styles.form_actions}>
        <span className={styles.link} onClick={() => showAlert(t("login.forgotPrompt"))}>
          {t("login.forgot") || "Forgot Password?"}
        </span>
        <span className={styles.link} onClick={() => navigate("/register")}>
          {t("login.register") || "Register Here"}
        </span>
      </div>
    </div>
  );
}
