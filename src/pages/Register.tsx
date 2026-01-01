// src/pages/Register.tsx
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { registerApi, loginApi } from "../services/auth";
import { useUserStore } from "../store/user";
import { useTranslation } from "react-i18next";
import Dialog from "../components/Dialog";

// Client-side password rule
function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export default function Register() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setToken = useUserStore((s) => s.setToken);
  const setUserInfo = useUserStore((s) => s.setUserInfo);

  // Fields
  const [username, setUsername] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  // const [realName, setRealName] = useState(""); // Visual only for now
  // const [phone, setPhone] = useState(""); // Visual for now

  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // const [referral, setReferral] = useState(""); // Referral hidden per reference UI focus

  // State
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmInfo, setConfirmInfo] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setAlertMessage(null);

    if (!username) { setAlertMessage(t("register.requiredUsername")); return; }
    // if (!realName) { setAlertMessage(t("register.requiredRealName")); return; }
    if (!password) { setAlertMessage(t("register.requiredPassword")); return; }
    if (!isValidPassword(password)) { setAlertMessage(t("register.passwordRule")); return; }
    if (password !== confirmPwd) { setAlertMessage(t("register.passwordMismatch")); return; }

    setSubmitting(true);
    try {
      // NOTE: We map the visuals to the backend API as best as possible.
      // 'username' -> 'name'
      const res = await registerApi({
        password,
        captcha: "",
        yqm: "", // referral empty
        name: username,
      });

      const ok = res && res.status && Number(res.status.errorCode) === 0;
      if (ok) {
        setConfirmInfo({ username: username, password });
        setModalOpen(true);
      } else {
        setAlertMessage(String(res?.status?.mess || res?.status?.msg || t("register.failed")));
      }
    } catch {
      setAlertMessage(t("register.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmAndAutoLogin() {
    setModalOpen(false);
    try {
      const r = await loginApi({ name: username, password });
      const ok = r && r.status && Number(r.status.errorCode) === 0;
      if (ok && r.data && typeof r.data === "object") {
        const token = String((r.data as any).token || "");
        const member = (r.data as any).member || {};
        // ... props
        if (token) {
          setToken(token);
          setUserInfo({ ...member });
          navigate("/home", { replace: true });
          return;
        }
      }
      setAlertMessage(t("register.autoLoginFailed"));
    } catch {
      setAlertMessage(t("register.autoLoginFailed"));
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t("register.title") || "Join RedCow"}</h1>
        <p style={{ fontSize: 14, color: '#9ca3af', marginTop: 4 }}>{t("register.subtitle")}</p>
      </div>

      <Dialog
        open={!!alertMessage}
        onClose={() => setAlertMessage(null)}
        title={t("common.alert") || "Alert"}
      >
        {alertMessage}
      </Dialog>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {/* Username */}
        <div className={styles.form_div}>
          <input
            type="text"
            className={styles.form_input}
            placeholder={t("register.username") || "Username"}
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
          />
          <UserIcon className={styles.form_icon} />
        </div>

        {/* Real Name (Visual) */}
        {/* <div className={styles.form_div}>
          <input
            type="text"
            className={styles.form_input}
            placeholder={t("register.realname") || "Full Name"}
            value={realName}
            onChange={(e) => setRealName(e.target.value)}
          />
          <IdentificationIcon className={styles.form_icon} />
        </div> */}

        {/* Phone (Visual) */}
        {/* <div className={styles.form_div}>
          <input
            type="text"
            className={styles.form_input}
            placeholder={t("register.phone") || "Phone Number"}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <PhoneIcon className={styles.form_icon} />
        </div> */}

        {/* Password */}
        <div className={styles.form_div}>
          <input
            type={showPwd ? "text" : "password"}
            className={styles.form_input}
            placeholder={t("register.password") || "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {showPwd ? (
            <EyeSlashIcon className={styles.password_toggle} onClick={() => setShowPwd(!showPwd)} />
          ) : (
            <EyeIcon className={styles.password_toggle} onClick={() => setShowPwd(!showPwd)} />
          )}
          <LockClosedIcon className={styles.form_icon} />
        </div>

        {/* Confirm Password */}
        <div className={styles.form_div}>
          <input
            type={showConfirmPwd ? "text" : "password"}
            className={styles.form_input}
            placeholder={t("register.confirm") || "Confirm Password"}
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            autoComplete="new-password"
          />
          {showConfirmPwd ? (
            <EyeSlashIcon className={styles.password_toggle} onClick={() => setShowConfirmPwd(!showConfirmPwd)} />
          ) : (
            <EyeIcon className={styles.password_toggle} onClick={() => setShowConfirmPwd(!showConfirmPwd)} />
          )}
          <LockClosedIcon className={styles.form_icon} />
        </div>

        {/* Invite Code */}
        <div className={styles.form_div}>
          <input
            type="text"
            className={styles.form_input}
            placeholder={t("register.inviteCode") || "Invite Code"}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          <LockClosedIcon className={styles.form_icon} />
        </div>

        <div className={styles.form_submit}>
          <button className={styles.form_submit_btn} type="submit" disabled={submitting}>
            {submitting ? t("register.processing") : t("register.submit") || "Register Now"}
          </button>
        </div>
      </form>

      <div className={styles.form_actions}>
        <p>
          {t("register.hasAccount")}{" "}
          <span className={styles.link} onClick={() => navigate("/login")}>
            {t("register.loginHere")}
          </span>
        </p>
      </div>

      {modalOpen && (
        <>
          <div className={styles.reset_backdrop}></div>
          <div className={styles.reset_modal}>
            <div className={styles.content}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#10b981" style={{ width: 48, height: 48, margin: '0 auto' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p style={{ marginBottom: 10, fontWeight: 'bold' }}>{t("register.success")}</p>
              <p style={{ fontSize: 13, color: '#ccc' }}>{(t("common.username") || "Username") + ": "}{confirmInfo.username}</p>
              <p style={{ fontSize: 13, color: '#ccc' }}>{(t("common.password") || "Password") + ": "}{confirmInfo.password}</p>
            </div>
            <button className={styles.action_btn} onClick={handleConfirmAndAutoLogin}>
              {t("register.startPlaying")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
