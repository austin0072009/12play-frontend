import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "../pages/Wallet.module.css";
import { fetchActionLog } from "../services/api";
import type { ActionLogItem } from "../services/types";
import kbzpayIcon from "../assets/kbzpay.jpg";
import wavepayIcon from "../assets/wavepay.jpg";

export default function WalletHistoryPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<"deposit" | "withdrawal">("deposit");
    const [records, setRecords] = useState<ActionLogItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Deposit status: 1=PENDING, 2=APPROVED, 3=FAIL, others=UNKNOWN
    const STATUS_TEXT_DEPOSIT: Record<number, string> = {
        1: t('walletHistory.pending'),
        2: t('walletHistory.approved'),
        3: t('walletHistory.failed'),
    };

    // Withdrawal status: 2,3=PENDING, 4=SUCCESS, others=UNKNOWN
    const STATUS_TEXT_WITHDRAWAL: Record<number, string> = {
        2: t('walletHistory.pending'),
        3: t('walletHistory.pending'),
        4: t('walletHistory.approved'),
    };

    const getStatusColor = (status: number, tab: 'deposit' | 'withdrawal') => {
        if (tab === 'withdrawal') {
            // Withdrawal: 2,3=pending (gray), 4=success (green)
            if (status === 2 || status === 3) return '#a8a29e'; // Gray: pending
            if (status === 4) return '#16a34a'; // Green: success
        } else {
            // Deposit: 1=pending, 2=approved, 3=failed
            if (status === 1) return '#a8a29e'; // Gray: pending
            if (status === 2) return '#16a34a'; // Green: approved
            if (status === 3) return '#dc2626'; // Red: failed
        }
        return '#6b7280'; // Gray for unknown statuses
    };

    const getStatusText = (status: number) => {
        const statusMap = activeTab === "withdrawal" ? STATUS_TEXT_WITHDRAWAL : STATUS_TEXT_DEPOSIT;
        return statusMap[status] || `UNKNOWN (${status})`;
    };

    useEffect(() => {
        setLoading(true);
        const type = activeTab === "deposit" ? 1 : 2;
        fetchActionLog({ type })
            .then((res) => {
                console.log("Fetched action log:", res);
                if (res.status.errorCode === 0 && res.data?.data) {
                    setRecords(res.data.data);
                } else {
                    setRecords([]);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [activeTab]);

    // Get payment icon based on account
    const getPaymentIcon = (account: string | undefined) => {
        if (!account) return wavepayIcon;
        const accountUpper = account.toUpperCase();
        if (accountUpper.includes("KBZPAY")) {
            return kbzpayIcon;
        }
        return wavepayIcon;
    };

    return (
        <div>
            <div className={styles.subTabContainer}>
                <div
                    className={`${styles.subTabItem} ${activeTab === 'deposit' ? styles.active : ''}`}
                    onClick={() => setActiveTab('deposit')}
                    style={{ justifyContent: 'center' }}
                >
                    <svg className={styles.subTabItemIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px">
                        <path stroke="currentColor" strokeWidth="2" d="M12 5v14M5 12h14" />
                    </svg>
                    <span>{t('walletHistory.depositHistory')}</span>
                </div>
                <div
                    className={`${styles.subTabItem} ${activeTab === 'withdrawal' ? styles.active : ''}`}
                    onClick={() => setActiveTab('withdrawal')}
                    style={{ justifyContent: 'center' }}
                >
                    <svg className={styles.subTabItemIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px">
                        <path stroke="currentColor" strokeWidth="2" d="M5 12h14" />
                    </svg>
                    <span>{t('walletHistory.withdrawalHistory')}</span>
                </div>
            </div>

            <div style={{ padding: "1rem" }}>
                {loading && <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>{t('walletHistory.loading')}</div>}

                {!loading && records.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                        {t('walletHistory.noRecords')}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {records.map((item, idx) => (
                        <div key={idx} style={{
                            background: '#222',
                            padding: '1rem',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid #333'
                        }}>
                            <div style={{ flex: 1 }}>
                                {/* Bill number with payment icon for deposits */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#fff' }}>{item.bill_no}</span>
                                    {activeTab === "deposit" && (
                                        <img 
                                            src={getPaymentIcon(item.account)} 
                                            alt="payment" 
                                            style={{ width: '2rem', height: '2rem', borderRadius: '4px', objectFit: 'cover' }}
                                        />
                                    )}
                                </div>

                                {/* For deposit: show payer_name (6 digit tail number) */}
                                {activeTab === "deposit" && item.payer_name && (
                                    <div style={{ color: '#CCA353', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '4px' }}>
                                        {item.payer_name}
                                    </div>
                                )}

                                {/* For withdrawal: show bank info OR fail reason (but not if approved) */}
                                {activeTab === "withdrawal" && (
                                    item.status === 2 ? (
                                        <div style={{ color: '#aaa', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>
                                            {item.bank_name}: {item.bank_card}
                                        </div>
                                    ) : !item.fail_reason ? (
                                        <div style={{ color: '#aaa', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>
                                            {item.bank_name}: {item.bank_card}
                                        </div>
                                    ) : (
                                        <div style={{ color: '#dc2626', fontSize: '1.2rem', marginBottom: '4px' }}>
                                            {t('walletHistory.reason')}: {item.fail_reason}
                                        </div>
                                    )
                                )}

                                <div style={{ color: '#888', fontSize: '1.2rem' }}>{item.created_at}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fff' }}>{item.money}</div>
                                <div style={{
                                    backgroundColor: getStatusColor(item.status, activeTab),
                                    color: '#fff',
                                    fontSize: '1.2rem',
                                    borderRadius: '4px',
                                    padding: '8px 16px',
                                    textAlign: 'center',
                                    minWidth: '8rem',
                                    fontWeight: '500'
                                }}>
                                    {getStatusText(item.status)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
