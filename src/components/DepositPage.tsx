import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "../pages/Wallet.module.css";
import { fetchRecharegeAmount, buildOrder, initiatePayment } from "../services/api";
import kbzpayImg from "../assets/kbzpay.jpg";
import wavepayImg from "../assets/wavepay.jpg";

// Type for individual payment channel
type PaymentChannel = {
    id: number;
    title: string;
    recharge_type: number;
    price_str: string[];
    is_zhizhu: number;
    remark?: string;
};

// Type for payment method (KBZpay, WAVEpay)
type PaymentMethod = {
    tid: number;
    title: string;
    recharge_type: string;
    charge: PaymentChannel[];
};

export default function DepositPage() {
    const MINIMUM_DEPOSIT = 3000;
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethodId, setSelectedMethodId] = useState<number>(0);
    const [selectedChannelId, setSelectedChannelId] = useState<number>(0);
    const [selectedAmount, setSelectedAmount] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const selectedMethod = useMemo(() => {
        return paymentMethods.find(m => m.tid === selectedMethodId) ?? null;
    }, [paymentMethods, selectedMethodId]);

    const selectedChannel = useMemo(() => {
        if (!selectedMethod) return null;
        return selectedMethod.charge.find(c => c.id === selectedChannelId) ?? null;
    }, [selectedMethod, selectedChannelId]);

    const rechargeAmounts = selectedChannel?.price_str ?? [];

    // Helper parsing logic
    function parseMinimum(remark: unknown, fallback: number): number {
        if (typeof remark !== "string") return fallback;
        const m = remark.match(/^\s*(\d+)\s*-\s*\d+\s*$/);
        return Math.max(m ? Number(m[1]) : fallback, MINIMUM_DEPOSIT);
    }

    // Helper function to map title to image
    function getImageByTitle(title: string): string {
        const titleLower = title.toLowerCase();
        if (titleLower.includes("kbz")) return kbzpayImg;
        if (titleLower.includes("wave")) return wavepayImg;
        return "https://dummyimage.com/150/fff/000"; // fallback
    }

    useEffect(() => {
        fetchRecharegeAmount("1").then((res) => {
            if (res?.status?.errorCode === 0 && Array.isArray(res.data)) {
                console.log("Fetched recharge amounts:", res.data);
                setPaymentMethods(res.data);
                
                // Auto-select first method and first channel
                if (res.data.length > 0) {
                    setSelectedMethodId(res.data[0].tid);
                    if (res.data[0].charge.length > 0) {
                        setSelectedChannelId(res.data[0].charge[0].id);
                        const firstChannel = res.data[0].charge[0];
                        const min = parseMinimum(firstChannel.remark, MINIMUM_DEPOSIT);
                        setSelectedAmount(String(min));
                    }
                }
            }
        });
    }, []);

    const handleSubmit = async () => {
        if (loading) return;
        if (!selectedChannel) {
            setError(t('deposit.selectChannel'));
            return;
        }

        const amount = Number(selectedAmount);
        const minimumAmount = parseMinimum(selectedChannel.remark, MINIMUM_DEPOSIT);
        
        if (isNaN(amount) || amount < minimumAmount) {
            setError(`${t('deposit.minimumAmount')} ${minimumAmount}`);
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Determine if this is a self-service or third-party channel
            const isSelfService = selectedChannel.is_zhizhu === 1;
            
            // Determine recharge_type based on payment method: 7 for KBZpay, 8 for WAVEpay
            const methodTitle = selectedMethod?.title.toLowerCase() || '';
            const rechargeType = methodTitle.includes('kbz') ? 7 : methodTitle.includes('wave') ? 8 : 7;
            
            // Step 1: Create the order
            const orderRes = await buildOrder({
                amount: amount,
                payer_name: "",
                recharge_id: selectedChannel.id,
                recharge_type: rechargeType,
            });

            if (orderRes?.status?.errorCode === 0 && orderRes.data) {
                const { tid, order_type } = orderRes.data;
                console.log("Order created:", orderRes.data);

                // Step 2: Check if this is a third-party payment requiring redirect
                if (order_type === 1 || !isSelfService) {
                    // Third-party payment (like BCATPAY) - need to get payment URL
                    const paymentRes = await initiatePayment({
                        order_id: tid,
                        recharge_id: selectedChannel.id,
                    });

                    if (paymentRes?.status?.errorCode === 0 && paymentRes.data?.pay_url) {
                        // Redirect to BCATPAY payment page
                        window.location.href = paymentRes.data.pay_url;
                    } else {
                        setError(paymentRes?.status?.msg || "Failed to initiate payment");
                    }
                } else {
                    // Self-service payment (order_type === 0 or is_zhizhu === 1)
                    // Navigate to deposit confirm page with order details
                    navigate("/deposit/confirm", {
                        state: { orderId: tid, amount: selectedAmount }
                    });
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
                {/* <h1>{t('deposit.methodLabel') || 'Payment Method'} <span>*</span></h1> */}
                    <h1>{t('deposit.channelLabel') || 'Channel'} <span>*</span></h1>

                {/* Render Payment Methods (KBZpay, WAVEpay) */}
                <div className={styles.channelBankDiv}>
                    {paymentMethods.map((method) => (
                        <div
                            key={method.tid}
                            className={styles.channelItem}
                            style={{
                                border: selectedMethodId === method.tid ? '2px solid #cb0000' : '2px solid transparent',
                                opacity: selectedMethodId === method.tid ? 1 : 0.6,
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onClick={() => {
                                setSelectedMethodId(method.tid);
                                // Auto-select first channel of this method
                                if (method.charge.length > 0) {
                                    setSelectedChannelId(method.charge[0].id);
                                    const min = parseMinimum(method.charge[0].remark, MINIMUM_DEPOSIT);
                                    setSelectedAmount(String(min));
                                }
                            }}
                        >
                            <img src={getImageByTitle(method.title)} alt={method.title} className={styles.bankImage} />
                        </div>
                    ))}
                    {paymentMethods.length === 0 && <div style={{ padding: '10px', color: '#888' }}>{t('deposit.loadingChannels')}</div>}
                </div>
            </div>

            {/* Show Channels when method is selected and has multiple channels */}
            {selectedMethod && selectedMethod.charge.length > 1 && (
                <div className={styles.channelDiv} style={{ marginTop: '2rem' }}>
                    <h1>{'Channel'} <span>*</span></h1>
                    <div className={styles.channelBankDiv}>
                        {selectedMethod.charge.map((channel, idx) => (
                            <div
                                key={channel.id}
                                className={styles.channelItem}
                                style={{
                                    border: selectedChannelId === channel.id ? '2px solid #cb0000' : '2px solid #444',
                                    opacity: selectedChannelId === channel.id ? 1 : 0.6,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#1a1a1a',
                                    minHeight: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => {
                                    setSelectedChannelId(channel.id);
                                    const min = parseMinimum(channel.remark, MINIMUM_DEPOSIT);
                                    setSelectedAmount(String(min));
                                }}
                            >
                                <p style={{ 
                                    color: '#fff', 
                                    fontSize: '1.4rem',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    margin: 0
                                }}>
                                    {selectedMethod.title.toLowerCase()}-{idx + 1}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                                onClick={() => {
                                    const nextAmount = Number(amt);
                                    if (selectedChannel) {
                                        const min = parseMinimum(selectedChannel.remark, MINIMUM_DEPOSIT);
                                        setSelectedAmount(String(Math.max(nextAmount, min)));
                                    } else {
                                        setSelectedAmount(amt);
                                    }
                                }}
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
                            if (selectedChannel) {
                                const val = Number(selectedAmount);
                                const min = parseMinimum(selectedChannel.remark, MINIMUM_DEPOSIT);
                                if (val < min) setSelectedAmount(String(min));
                            }
                        }}
                    />
                    <p className={styles.helperText}>
                        {t('deposit.minimumLabel')} <span className={styles.primary}>
                            {selectedChannel ? parseMinimum(selectedChannel.remark, MINIMUM_DEPOSIT).toLocaleString() : MINIMUM_DEPOSIT.toLocaleString()}
                        </span>
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
