import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "../pages/Wallet.module.css";
import { fetchBankList, fetchBalance, withdrawal, transferOut } from "../services/api";
import type { BankInfo } from "../services/types";
import { useNavigate } from "react-router-dom";
import Dialog from "./Dialog";
import kbzpayImg from "../assets/kbzpay.jpg";
import wavepayImg from "../assets/wavepay.jpg";

export default function WithdrawalPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeTab] = useState("bank"); // bank | crypto (crypto coming soon)
    const [bankList, setBankList] = useState<BankInfo | null>(null);
    const [selectedAmount, setSelectedAmount] = useState("");
    const [balance, setBalance] = useState("0.00");
    const [turnover, setTurnover] = useState("0.00");
    const [submitting, setSubmitting] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Helper function to get bank image based on bank name
    const getBankImage = (bankName: string | undefined): string | null => {
        if (!bankName) return null;
        const name = bankName.toUpperCase();
        if (name.includes("KBZ")) return kbzpayImg;
        if (name.includes("WAVE")) return wavepayImg;
        return null;
    };

    useEffect(() => {
        // Basic init - fetch balance and turnover
        fetchBalance().then((res) => {
            if (res?.status?.errorCode === 0 && res.data) {
                setBalance(String(res.data.balance));
                setTurnover(String(res.data.ml_money));
            }
        });

        // Fetch bank binding
        fetchBankList().then((data) => {
            //console.log("Bank List:", data);
            if (data?.data) {
                setBankList(data.data);
            }
        }).catch(console.error);

        // Auto transfer main wallet? rk has this call
        transferOut().catch(console.error);

    }, []);

    const submitWithdrawal = async () => {
        if (!selectedAmount) return;
        setSubmitting(true);
        try {
            const res = await withdrawal(Number(selectedAmount), "1");
            if (res.status.errorCode === 0) {
                setAlertMessage(t('withdrawal.success'));
                // Refresh balance and turnover
                fetchBalance().then(r => {
                    if (r.status.errorCode === 0 && r.data) {
                        setBalance(String(r.data.balance));
                        setTurnover(String(r.data.ml_money));
                    }
                });
            } else {
                setAlertMessage(`${t('withdrawal.error')} ${res.status.mess || res.status.msg}`);
            }
        } catch (e) {
            setAlertMessage(t('withdrawal.networkError'));
        } finally {
            setSubmitting(false);
        }
    };

    const hasBank = !!(bankList && bankList.bank_card);

    return (
        <div style={{ minHeight: '100%', paddingBottom: '5rem' }}>
            {/* Sub Tabs */}
            {/* <div className={styles.subTabContainer}>
                <div
                    className={`${styles.subTabItem} ${activeTab === 'bank' ? styles.active : ''}`}
                    onClick={() => setActiveTab('bank')}
                >
                    <svg className={styles.subTabItemIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px">
                        <g clipPath="url(#BankTransfer_svg__a)">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3.512A9 9 0 0 1 20.294 15.5c-.431.833-1.394 2.5-1.794 2.5m-3 2.294a9 9 0 0 1-11-13.27"></path>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m18.211 16 .286 2.042 2.042-.286M5.5 8.024 5.02 6.02l-2.005.48"></path>
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8.024 16.005h8.004"></path>
                            <path fill="currentColor" fillRule="evenodd" d="M11.733 6.077 7.186 9.125c-.34.229-.183.771.224.771v5.634c0 .26.205.47.458.47h8.356c.253 0 .458-.21.458-.47V9.896c.313 0 .437-.414.179-.594l-4.62-3.22a.45.45 0 0 0-.508-.005m-2.148 4.758a.58.58 0 0 0-.572.587v3.287a.58.58 0 0 0 .572.587.58.58 0 0 0 .572-.587v-3.287a.58.58 0 0 0-.572-.587m1.946.587a.58.58 0 0 1 .572-.587.58.58 0 0 1 .573.587v3.287a.58.58 0 0 1-.573.587.58.58 0 0 1-.572-.587zm3.09-.587a.58.58 0 0 0-.572.587v3.287a.58.58 0 0 0 .573.587.58.58 0 0 0 .572-.587v-3.287a.58.58 0 0 0-.572-.587Z" clipRule="evenodd"></path>
                        </g>
                        <defs><clipPath id="BankTransfer_svg__a"><path fill="#fff" d="M0 0h24v24H0z"></path></clipPath></defs>
                    </svg>
                    <span>Bank Transfer</span>
                </div>
                <div
                    className={`${styles.subTabItem} ${activeTab === 'crypto' ? styles.active : ''}`}
                    onClick={() => setActiveTab('crypto')}
                >
                    <svg className={styles.subTabItemIcon} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24px" height="24px">
                        <g clipPath="url(#Crypto_svg__a)">
                            <path fillRule="evenodd" d="M9.412 21.66c5.334 1.429 10.818-1.737 12.247-7.072 1.43-5.334-1.736-10.818-7.07-12.247C9.253.91 3.77 4.077 2.34 9.41.91 14.747 4.077 20.23 9.41 21.66ZM8.97 6.427l2.276.61.576-1.928 1.07.227-.54 2.016.73.196.181.05.654-1.868 1.11.298-.614 1.935q1.883.686 2.393 1.559.368.63.164 1.39-.44 1.643-2.585 1.305 1.806.72 1.983 1.866.07.446-.071.974-.14.523-.398.876a1.7 1.7 0 0 1-.615.54 2.8 2.8 0 0 1-.771.266 3.8 3.8 0 0 1-.95.035q-.6-.046-1.312-.193l-.541 1.826-1.11-.298.486-1.814-1.11-.298-.487 1.815-1.125-.242.556-1.855-.61-.164.005-.017-1.747-.587.69-1.243.833.223c.345.092.559.006.684-.109l1.414-5.278c-.01-.67-1.006-.984-1.502-1.058zm5.04 7.836c.045-.166.088-.378.056-.583a1.2 1.2 0 0 0-.206-.523 1.6 1.6 0 0 0-.461-.401q-.518-.312-1.476-.563l-.666-.178-.699 2.609.507.136c.81.216 1.331.246 1.678.235.366-.014.664-.036.811-.14.244-.173.376-.29.456-.592m.308-3.23q.242-.225.326-.56.09-.335.052-.558a.8.8 0 0 0-.188-.397 2 2 0 0 0-.334-.314 2.3 2.3 0 0 0-.486-.258 10 10 0 0 0-1.184-.386l-.3-.08-.67 2.505.506.136q1.696.454 2.278-.088" clipRule="evenodd"></path>
                        </g>
                        <defs><clipPath id="Crypto_svg__a"><path d="M0 0h24v24H0z"></path></clipPath></defs>
                    </svg>
                    <span>Crypto</span>
                </div>
            </div> */}

            {activeTab === 'bank' && (
                <div style={{ padding: "2rem", marginTop: "1rem", paddingBottom: "5rem" }}>
                    {/* Balance Info */}
                    <div className={styles.balanceRow}>
                        <span className={styles.balanceLabel}>{t('withdrawal.mainWallet')}</span>
                        <span className={styles.balanceAmount}>{Number(balance).toLocaleString()}</span>
                    </div>

                    <div className={styles.infoCard}>
                        <label style={{
                            display: 'block',
                            marginBottom: '1rem',
                            fontSize: '1.6rem',
                            fontWeight: '600',
                            color: 'var(--color-white)'
                        }}>
                            {t('withdrawal.amountLabel')}
                        </label>
                        <input
                            type="number"
                            value={selectedAmount}
                            onChange={(e) => setSelectedAmount(e.target.value)}
                            placeholder={t('withdrawal.amountPlaceholder')}
                            className={styles.inputEl}
                            style={{
                                border: '2px solid rgba(203, 0, 0, 0.3)',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                fontSize: '2rem',
                                fontWeight: '600'
                            }}
                        />
                        {bankList && (
                            <p className={styles.helperText}>
                                {t('withdrawal.limitLabel')} <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{Number(bankList.limit_start).toLocaleString()}</span> |
                                Turnover: <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{Number(turnover).toLocaleString()}</span>
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                            marginBottom: '1.5rem',
                            fontSize: '1.8rem',
                            fontWeight: '600',
                            color: 'var(--color-white)'
                        }}>{t('withdrawal.bankAccountTitle')}</h3>
                        {hasBank ? (
                            <div className={styles.bankCard}>
                                {getBankImage(bankList?.bank_name) && (
                                    <img
                                        src={getBankImage(bankList?.bank_name)!}
                                        className={styles.bankCardImage}
                                        alt={bankList?.bank_name}
                                    />
                                )}

                                <div className={styles.bankCardInfo}>
                                    <div className={styles.bankCardName}>{bankList?.bank_username}</div>
                                    <div className={styles.bankCardNumber}>{bankList?.bank_card}</div>
                                    <div className={styles.bankCardType}>{bankList?.bank_name}</div>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => navigate("/bank/add")}
                                className={styles.addBankCard}
                            >
                                <span className={styles.addIcon}>+</span>
                                <span>{t('withdrawal.bindBank')}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={submitWithdrawal}
                        disabled={submitting || !hasBank}
                        className={styles.primaryButton}
                        style={{ marginBottom: '3rem' }}
                    >
                        {submitting ? t('withdrawal.processingBtn') : t('withdrawal.withdrawBtn')}
                    </button>
                </div>
            )}

            {activeTab === 'crypto' && (
                <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                    {t('withdrawal.comingSoon')}
                </div>
            )}

            <Dialog
                open={!!alertMessage}
                onClose={() => setAlertMessage(null)}
                title="Alert"
            >
                {alertMessage}
            </Dialog>
        </div>
    );
}
