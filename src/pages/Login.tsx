// src/pages/Login.tsx
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { InformationCircleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useUserStore } from '../store/user';
import { loginApi } from '../services/auth';
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

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
      setErr("Please enter your account and password.");
      return;
    }
    setSubmitting(true);
    setErr("");
    try {
      if (remember && username) {
        localStorage.setItem(REMEMBER_KEY, username);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
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

        if (!token) {
          setErr("Missing token in response.");
          return;
        }

        setToken(token);
        setUserInfo({ ...member, yzflag, qk_pwd });

        let to = "/home";
        if (location?.state?.from) {
          to = location.state.from;
        }
        navigate(to, { replace: true });
      } else {
        const message =
          (res && res.status && (res.status.mess || res.status.msg)) || "Login failed";
        setErr(String(message));
      }
    } catch {
      setErr("Network error, please try again.");
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
            {submitting ? "Logging in..." : t("login.submit") || "Login"}
          </button>
        </div>
      </form>

      <div className={styles.form_actions}>
        <span className={styles.link} onClick={() => alert("Forgot password?")}>
          {t("login.forgot") || "Forgot Password?"}
        </span>
        <span className={styles.link} onClick={() => navigate("/register")}>
          {t("login.register") || "Register Here"}
        </span>
      </div>
    </div>
  );
}
