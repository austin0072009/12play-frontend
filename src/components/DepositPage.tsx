import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "../pages/Wallet.module.css";
import { fetchRecharegeAmount, buildOrder, initiatePayment } from "../services/api";
import type { Bank } from "../services/types";
import { showAlert } from "../store/alert";
import kbzpayImg from "../assets/kbzpay.jpg";
import wavepayImg from "../assets/wavepay.jpg";

export default function DepositPage() {
    const { t } = useTranslation();
    // Initial dummy state to match UI, will be replaced by API
    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBankId, setSelectedBankId] = useState<number>(0);
    const [selectedAmount, setSelectedAmount] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    // To match original UI's "depositChannels" which seemed to be the payment TYPES (like Pay vs Bank vs Crypto) 
    // vs "banks" which were specific banks? 
    // Looking at rk logic: it gets "channels" which contain "banks" or "types". 
    // In rk: "banks" are the main list.

    const selectedBank = useMemo(() => {
        return banks.find(b => b.id === selectedBankId) ?? null;
    }, [banks, selectedBankId]);

    const rechargeAmounts = selectedBank?.rechargeAmounts ?? [];

    // Helper parsing logic
    function parseAmounts(input: unknown): string[] {
        if (Array.isArray(input)) return input.map(String);
        if (typeof input === "string") {
            return input.split(/[,|\s]+/).map(s => s.trim()).filter(Boolean);
        }
        return [];
    }

    function parseMinimum(remark: unknown, fallback: number): number {
        if (typeof remark !== "string") return fallback;
        const m = remark.match(/^\s*(\d+)\s*-\s*\d+\s*$/);
        return m ? Number(m[1]) : fallback;
    }

    // Helper function to map title to image
    function getImageByTitle(title: string): string {
        const titleLower = title.toLowerCase();
        if (titleLower.includes("kbz")) return kbzpayImg;
        if (titleLower.includes("wave")) return wavepayImg;
        return "https://dummyimage.com/150/fff/000"; // fallback
    }

    useEffect(() => {
        // Basic setup similar to rk
        fetchRecharegeAmount("1").then((res) => {
            if (res?.status?.errorCode === 0 && Array.isArray(res.data)) {
                // Map to our Bank type
                const mapped = res.data.map((item: any, idx: number) => {
                    const title = item.title || "Channel " + idx;
                    const img = getImageByTitle(title);

                    const d = item.charge?.[0];
                    const amounts = parseAmounts(d?.price_str);
                    const min = parseMinimum(d?.remark, 1000);

                    return {
                        id: item.tid || idx,
                        name: title,
                        image: img,
                        type: item.recharge_type,
                        rechargeAmounts: amounts,
                        minimumAmount: min,
                        rechargeId: item.tid // Store the actual recharge config ID for payment
                    };
                });
                setBanks(mapped);
                if (mapped.length > 0) {
                    setSelectedBankId(mapped[0].id);
                    setSelectedAmount(String(mapped[0].minimumAmount));
                }
            }
        });
    }, []);

    const handleSubmit = async () => {
        if (loading) return;
        if (!selectedBank) {
            setError(t('deposit.selectChannel'));
            return;
        }

        const amount = Number(selectedAmount);
        if (isNaN(amount) || amount < selectedBank.minimumAmount) {
            setError(`${t('deposit.minimumAmount')} ${selectedBank.minimumAmount}`);
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Step 1: Create the order
            const orderRes = await buildOrder({
                amount: amount,
                payer_name: "",
                recharge_id: (selectedBank as any).rechargeId || 99,
                recharge_type: Number(selectedBank.type) || 0,
            });

            if (orderRes?.status?.errorCode === 0 && orderRes.data) {
                const { tid, order_type } = orderRes.data;

                // Step 2: Check if this is a third-party payment requiring redirect
                if (order_type === 1) {
                    // Third-party payment (like BCATPAY) - need to get payment URL
                    const paymentRes = await initiatePayment({
                        order_id: tid,
                        recharge_id: (selectedBank as any).rechargeId || 99,
                    });

                    if (paymentRes?.status?.errorCode === 0 && paymentRes.data?.pay_url) {
                        // Redirect to BCATPAY payment page
                        window.location.href = paymentRes.data.pay_url;
                    } else {
                        setError(paymentRes?.status?.msg || "Failed to initiate payment");
                    }
                } else {
                    // Self-service payment (order_type === 0)
                    showAlert(`${t('deposit.orderCreated')} ${tid}`);
                    // Could navigate to a self-service payment page here
                }
            } else {
                setError(orderRes?.status?.msg || "Failed to create order");
            }
        } catch (e: any) {
            console.error("Deposit error:", e);
            setError(e?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100%', paddingBottom: '5rem' }}>
            {/* Sub Tabs - Keeping Original UI Structure */}
            {/* <div className={styles.subTabContainer}>
                <div className={`${styles.subTabItem} ${styles.active}`}>
                    <svg className={styles.subTabItemIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px">
                        <g clipPath="url(#FastDeposit_svg__a)">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M4 20h17a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-8M2 11h6m-5 5h3M5 7h4"></path>
                            <path fill="currentColor" fillRule="evenodd" d="M17.65 7.24c.448.701 1.217 1.727 1.88 2.109.238.138.47.375.47.651v4.217a.52.52 0 0 1-.24.432c-.701.449-1.727 1.218-2.109 1.88-.138.24-.375.471-.651.471H8.739a.5.5 0 0 1-.465-.686l3.6-9A.5.5 0 0 1 12.338 7h4.879c.176 0 .338.092.432.24Zm-3.22 7.834v.653h.465v-.653q.957-.051 1.492-.515.535-.465.535-1.223 0-.484-.227-.82a1.7 1.7 0 0 0-.62-.555 3.4 3.4 0 0 0-.903-.332l-.277-.07v-1.414q.702.093.761.707h1.188a1.6 1.6 0 0 0-.25-.864 1.7 1.7 0 0 0-.68-.61 2.5 2.5 0 0 0-1.02-.269v-.656h-.464v.656a2.6 2.6 0 0 0-1.016.274 1.8 1.8 0 0 0-.691.61q-.25.378-.25.87 0 .645.421 1.032.426.382 1.16.558l.376.094v1.492a1.18 1.18 0 0 1-.645-.262q-.25-.218-.277-.605h-1.192q.024.89.59 1.371.567.48 1.524.531m-.496-3.875a.5.5 0 0 1-.2-.414q0-.241.18-.418.18-.175.516-.223v1.297a1.6 1.6 0 0 1-.496-.242m1.543 1.723a.48.48 0 0 1 .207.41q0 .277-.215.465-.21.187-.574.238v-1.37q.378.104.582.257" clipRule="evenodd"></path>
                        </g>
                        <defs><clipPath id="FastDeposit_svg__a"><path fill="#fff" d="M0 0h24v24H0z"></path></clipPath></defs>
                    </svg>
                    <span>Fast Deposit</span>
                </div>
                <div className={styles.subTabItem} style={{ opacity: 0.5 }}>
                    <svg className={styles.subTabItemIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px">
                        <path stroke="currentColor" strokeWidth="2" d="M9 3.5a9 9 0 0111.3 12c-.4.8-1.4 2.5-1.8 2.5m-3 2.3a9 9 0 01-11-13.3"></path>
                    </svg>
                    <span>Bank Transfer</span>
                </div>
                <div className={styles.subTabItem} style={{ opacity: 0.5 }}>
                    <svg className={styles.subTabItemIcon} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24px" height="24px">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                    </svg>
                    <span>Crypto</span>
                </div>
            </div> */}

            <div className={styles.channelDiv}>
                <h1>{t('deposit.channelLabel')} <span>*</span></h1>

                {/* Render Banks/Channels */}
                <div className={styles.channelBankDiv}>
                    {banks.map((channel) => (
                        <div
                            key={channel.id}
                            className={styles.channelItem}
                            style={{
                                border: selectedBankId === channel.id ? '2px solid #cb0000' : '2px solid transparent',
                                opacity: selectedBankId === channel.id ? 1 : 0.6,
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onClick={() => {
                                setSelectedBankId(channel.id);
                            }}
                        >
                            <img src={channel.image} alt={channel.name} className={styles.bankImage} />
                            {/* <p className={styles.bankName}>{channel.name}</p> */}
                        </div>
                    ))}
                    {banks.length === 0 && <div style={{ padding: '10px', color: '#888' }}>{t('deposit.loadingChannels')}</div>}
                </div>

                <div className={styles.channelInfoDiv}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
                    <p>{t('deposit.failureHint')}</p>
                </div>
            </div>

            <div style={{ padding: "2rem", marginTop: "1rem", paddingBottom: "5rem" }}>
                {/* Error Message Display */}
                {error && (
                    <div className={styles.errorMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {error}
                    </div>
                )}

                {/* Quick Amount Buttons */}
                {rechargeAmounts.length > 0 && (
                    <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                        {rechargeAmounts.map(amt => (
                            <button
                                key={amt}
                                onClick={() => setSelectedAmount(amt)}
                                className={`${styles.amountQuick} ${selectedAmount === amt ? styles.active : ''}`}
                            >
                                {Number(amt).toLocaleString()}
                            </button>
                        ))}
                    </div>
                )}

                <div className={styles.infoCard}>
                    <label style={{
                        display: 'block',
                        marginBottom: '1rem',
                        fontSize: '1.6rem',
                        fontWeight: '600',
                        color: 'var(--color-white)'
                    }}>
                        {t('deposit.amountLabel')}
                    </label>
                    <input
                        type="number"
                        placeholder={t('deposit.amountPlaceholder')}
                        className={styles.inputEl}
                        value={selectedAmount}
                        onChange={(e) => setSelectedAmount(e.target.value)}
                        onBlur={() => {
                            if (selectedBank) {
                                const val = Number(selectedAmount);
                                if (val < selectedBank.minimumAmount) setSelectedAmount(String(selectedBank.minimumAmount));
                            }
                        }}
                    />
                    <p className={styles.helperText}>
                        {t('deposit.minimumLabel')} <span className={styles.primary}>{selectedBank?.minimumAmount?.toLocaleString() || 0}</span>
                    </p>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={styles.primaryButton}
                    style={{ marginBottom: '3rem' }}
                >
                    {loading ? t('deposit.processingBtn') : t('deposit.depositBtn')}
                </button>
            </div>
        </div>
    );
}
