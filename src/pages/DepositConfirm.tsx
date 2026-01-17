import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./DepositConfirm.module.css";
import { fetchOrderStatus, payOrder } from "../services/api";
import type { GatheringOrderInfo } from "../services/types";
import { showAlert } from "../store/alert";
import { getReferralCode } from "../utils/referral";
import { trackFirstDeposit } from "../utils/analytics";

export default function DepositConfirm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const routeState = location.state as { orderId?: number; amount?: string } | null;
    const orderId = routeState?.orderId ?? null;

    // 10 minute countdown
    const COUNTDOWN_SECONDS = 10 * 60;
    const startedAtRef = useRef<number>(Date.now());
    const [secondsLeft, setSecondsLeft] = useState<number>(COUNTDOWN_SECONDS);

    useEffect(() => {
        const id = window.setInterval(() => {
            const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
            const left = Math.max(0, COUNTDOWN_SECONDS - elapsed);
            setSecondsLeft(left);
        }, 1000);

        // Calculate immediately to avoid first second delay
        const initElapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
        setSecondsLeft(Math.max(0, COUNTDOWN_SECONDS - initElapsed));

        return () => window.clearInterval(id);
    }, []);

    const mmss = useMemo(() => {
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        const mm = ("0" + String(m)).slice(-2);
        const ss = ("0" + String(s)).slice(-2);
        return mm + ":" + ss;
    }, [secondsLeft]);

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [tailNo, setTailNo] = useState<string>("");
    const [orderInfo, setOrderInfo] = useState<GatheringOrderInfo | null>(null);
    const [copiedKey, setCopiedKey] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            return;
        }
        fetchOrderStatus(orderId).then((res) => {
            console.log("Fetched order info:", res);
            if (res?.code === 200 && res.data) {
                setOrderInfo(res.data);
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [orderId]);

    function copyToClipboard(text: string, key: string) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedKey(key);
                setTimeout(() => setCopiedKey(""), 1500);
            }).catch(() => fallbackCopy(text, key));
        } else {
            fallbackCopy(text, key);
        }
    }

    function fallbackCopy(text: string, key: string) {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.focus();
        el.select();
        try { document.execCommand("copy"); } catch { /* ignore */ }
        document.body.removeChild(el);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(""), 1500);
    }

    async function handleSubmit() {
        if (!orderId || tailNo.length !== 6 || submitting) return;

        setSubmitting(true);
        try {
            const res = await payOrder(orderId, tailNo);
            console.log("Pay order response:", res);
            if (res?.code === 200) {
                // GA4: Track first deposit (only fires once per user)
                const depositAmount = orderInfo?.gatheringAmount || Number(routeState?.amount) || 0;
                trackFirstDeposit(getReferralCode(), depositAmount);

                showAlert(t("depositConfirm.success"));
                navigate("/wallet");
            } else {
                showAlert(res?.message || t("depositConfirm.error"));
            }
        } catch (err) {
            showAlert(t("depositConfirm.error"));
        } finally {
            setSubmitting(false);
        }
    }

    if (!orderId) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                    <h1 className={styles.title}>{t("depositConfirm.title")}</h1>
                    <div style={{ width: 24 }} />
                </div>
                <div className={styles.content}>
                    <div className={styles.errorCard}>
                        <p>{t("depositConfirm.noOrder")}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>
                <h1 className={styles.title}>{t("depositConfirm.title")}</h1>
                <div style={{ width: 24 }} />
            </div>

            <div className={styles.content}>
                {/* Countdown Timer */}
                <div className={styles.timerCard}>
                    <p className={styles.timerText}>
                        {t("depositConfirm.completeWithin")} <span className={styles.timerHighlight}>{mmss}</span> {t("depositConfirm.andEnterDigits")}
                    </p>
                </div>

                {loading ? (
                    <div className={styles.loadingCard}>
                        <p>{t("common.loading")}</p>
                    </div>
                ) : orderInfo ? (
                    <>
                        {/* Order Information */}
                        <div className={styles.infoCard}>
                            <h2 className={styles.cardTitle}>{t("depositConfirm.orderInfo")}</h2>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>{t("depositConfirm.amount")}</span>
                                <span className={styles.infoValue}>{orderInfo.gatheringAmount?.toLocaleString()} MMK</span>
                            </div>
                        </div>

                        {/* Recipient Account */}
                        <div className={styles.infoCard}>
                            <h2 className={styles.cardTitle}>{t("depositConfirm.recipientAccount")}</h2>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>{t("depositConfirm.bank")}</span>
                                <span className={styles.infoValue}>{orderInfo.gatheringChannelName}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>{t("depositConfirm.accountName")}</span>
                                <span className={styles.infoValue}>{orderInfo.accountHolder}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>{t("depositConfirm.accountNumber")}</span>
                                <div className={styles.infoValueWithCopy}>
                                    <span className={styles.infoValue}>{orderInfo.bankCardAccount}</span>
                                    <button
                                        className={styles.copyBtn}
                                        onClick={() => copyToClipboard(orderInfo.bankCardAccount || "", "account")}
                                    >
                                        {copiedKey === "account" ? t("depositConfirm.copied") : t("depositConfirm.copy")}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Number Input */}
                        <div className={styles.infoCard}>
                            <h2 className={styles.cardTitle}>{t("depositConfirm.transactionNumber")}</h2>
                            <p className={styles.inputHint}>{t("depositConfirm.last6Digits")}</p>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    placeholder={t("depositConfirm.enterDigits")}
                                    className={styles.inputEl}
                                    value={tailNo}
                                    onChange={(e) => setTailNo((e.target.value || "").replace(/\D/g, "").slice(0, 6))}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                                    autoFocus
                                />
                                <span className={styles.inputCounter}>{tailNo.length}/6</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className={styles.submitBtn}
                            onClick={handleSubmit}
                            disabled={secondsLeft <= 0 || tailNo.length !== 6 || submitting}
                        >
                            {secondsLeft > 0
                                ? (submitting
                                    ? t("depositConfirm.submitting")
                                    : `${t("depositConfirm.submit")} (${mmss})`)
                                : t("depositConfirm.expired")}
                        </button>

                        {/* Reminder */}
                        <div className={styles.reminderCard}>
                            <p className={styles.reminderText}>{t("depositConfirm.reminder")}</p>
                        </div>
                    </>
                ) : (
                    <div className={styles.errorCard}>
                        <p>{t("depositConfirm.loadError")}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
