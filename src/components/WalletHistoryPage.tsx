import { useState, useEffect } from "react";
import styles from "../pages/Wallet.module.css";
import { fetchActionLog } from "../services/api";
import type { ActionLogItem } from "../services/types";

export default function WalletHistoryPage() {
    const [activeTab, setActiveTab] = useState<"deposit" | "withdrawal">("deposit");
    const [records, setRecords] = useState<ActionLogItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const type = activeTab === "deposit" ? 1 : 2;
        fetchActionLog({ type })
            .then((res) => {
                if (res.status.errorCode === 0 && res.data?.data) {
                    setRecords(res.data.data);
                } else {
                    setRecords([]);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [activeTab]);

    const STATUS_TEXT: Record<number, string> = {
        1: "PENDING",
        2: "APPROVED",
        3: "FAIL",
        5: "FAIL"
    };

    const getStatusColor = (status: number) => {
        if (status === 1) return '#FFA500'; // Orange
        if (status === 2) return '#00FF00'; // Green
        return '#FF0000'; // Red
    };

    return (
        <div>
            <div className={styles.subTabContainer}>
                <div
                    className={`${styles.subTabItem} ${activeTab === 'deposit' ? styles.active : ''}`}
                    onClick={() => setActiveTab('deposit')}
                    style={{ justifyContent: 'center' }}
                >
                    {/* Reusing icons from main tabs logic or simplifying since RedCow original history page structure was slightly different but tabs fit well */}
                    <svg className={styles.subTabItemIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px">
                        <path stroke="currentColor" strokeWidth="2" d="M12 5v14M5 12h14" />
                    </svg>
                    <span>Deposit History</span>
                </div>
                <div
                    className={`${styles.subTabItem} ${activeTab === 'withdrawal' ? styles.active : ''}`}
                    onClick={() => setActiveTab('withdrawal')}
                    style={{ justifyContent: 'center' }}
                >
                    <svg className={styles.subTabItemIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px">
                        <path stroke="currentColor" strokeWidth="2" d="M5 12h14" />
                    </svg>
                    <span>Withdrawal History</span>
                </div>
            </div>

            <div style={{ padding: "1rem" }}>
                {loading && <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Loading...</div>}

                {!loading && records.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                        No records found
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
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>{item.bill_no}</div>
                                <div style={{ color: '#888', fontSize: '0.8rem' }}>{item.created_at}</div>

                                {item.fail_reason && <div style={{ color: '#ff4d4f', fontSize: '0.8rem', marginTop: '4px' }}>{item.fail_reason}</div>}

                                {/* Show bank info if available */}
                                {item.bank_card && (
                                    <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {item.bank_name} • {item.bank_card}
                                    </div>
                                )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#CCA353' }}>{item.money}</div>
                                <div style={{
                                    color: getStatusColor(item.status),
                                    fontSize: '0.8rem',
                                    border: `1px solid ${getStatusColor(item.status)}`,
                                    borderRadius: '4px',
                                    padding: '2px 8px',
                                    display: 'inline-block',
                                    marginTop: '6px'
                                }}>
                                    {STATUS_TEXT[item.status] || 'UNKNOWN'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
