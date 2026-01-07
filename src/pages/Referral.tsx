import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/user';
import Dialog from '../components/Dialog';
import styles from './Referral.module.css';

export default function Referral() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userInfo = useUserStore((s) => s.userInfo);
    const [inviterCode, setInviterCode] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasInviter, setHasInviter] = useState(false);
    const [copied, setCopied] = useState(false);

    // Alert state
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // TODO: Fetch user's referral data from API
        // Sample API call structure:
        // fetchReferralInfo().then(res => {
        //   setReferralCode(res.data.referralCode);
        //   setHasInviter(res.data.hasInviter);
        // });

        // Mock data for now
        const mockReferralCode = userInfo?.username ? `${userInfo.username.toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}` : 'ABCD1234';
        setReferralCode(mockReferralCode);
        setHasInviter(false); // Change to true if user already has inviter
    }, [userInfo]);

    const handleSubmitInviter = async () => {
        if (!inviterCode.trim()) {
            setIsSuccess(false);
            setAlertMessage(t('referral.emptyCode'));
            return;
        }

        setIsSubmitting(true);

        try {
            // TODO: Call API to submit inviter code
            // const res = await submitInviterCode({ inviterCode });
            
            // Mock success response
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setIsSuccess(true);
            setAlertMessage(t('referral.submitSuccess'));
            setHasInviter(true);
            setInviterCode('');
        } catch (error) {
            console.error('Error submitting inviter code:', error);
            setIsSuccess(false);
            setAlertMessage(t('referral.submitError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyReferralCode = () => {
        navigator.clipboard.writeText(referralCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShareReferralLink = () => {
        const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
        navigator.clipboard.writeText(referralLink).then(() => {
            setIsSuccess(true);
            setAlertMessage(t('referral.copiedSuccess'));
        });
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <h1 className={styles.title}>{t('referral.title')}</h1>
                <div className={styles.placeholder}></div>
            </div>

            <div className={styles.content}>
                {/* Referral Code Section */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.iconWrapper}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <h2 className={styles.sectionTitle}>Your Referral Code</h2>
                    </div>

                    <div className={styles.codeCard}>
                        <div className={styles.codeDisplay}>
                            <span className={styles.code}>{referralCode}</span>
                            <button 
                                className={styles.copyButton}
                                onClick={handleCopyReferralCode}
                            >
                                {copied ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className={styles.codeDescription}>
                            {t('referral.shareThisCode')}
                        </p>
                        <button 
                            className={styles.shareButton}
                            onClick={handleShareReferralLink}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                            Share Referral Link
                        </button>
                    </div>
                </div>

                {/* Inviter Code Section */}
                {!hasInviter && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.iconWrapper}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <line x1="19" y1="8" x2="19" y2="14"></line>
                                    <line x1="22" y1="11" x2="16" y2="11"></line>
                                </svg>
                            </div>
                            <h2 className={styles.sectionTitle}>{t('referral.enterInviterCode')}</h2>
                        </div>

                        <div className={styles.inputCard}>
                            <p className={styles.inputDescription}>
                                {t('referral.ifReferred')}
                            </p>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder={t('referral.inviterCodePlaceholder')}
                                value={inviterCode}
                                onChange={(e) => setInviterCode(e.target.value.toUpperCase())}
                                disabled={isSubmitting}
                            />
                            <button
                                className={styles.submitButton}
                                onClick={handleSubmitInviter}
                                disabled={isSubmitting || !inviterCode.trim()}
                            >
                                {isSubmitting ? (
                                    <div className={styles.spinner}></div>
                                ) : (
                                    t('referral.submitCode')
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {hasInviter && (
                    <div className={styles.section}>
                        <div className={styles.successCard}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.successIcon}>
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <h3 className={styles.successTitle}>{t('referral.inviterLinked')}</h3>
                            <p className={styles.successDescription}>
                                {t('referral.successMessage')}
                            </p>
                        </div>
                    </div>
                )}

                {/* Benefits Section */}
                <div className={styles.section}>
                    <h2 className={styles.benefitsTitle}>{t('referral.benefits')}</h2>
                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitCard}>
                            <div className={styles.benefitIcon}>🎁</div>
                            <h3 className={styles.benefitTitle}>{t('referral.earnRewardsTitle')}</h3>
                            <p className={styles.benefitDescription}>
                                {t('referral.earnRewardsDesc')}
                            </p>
                        </div>
                        <div className={styles.benefitCard}>
                            <div className={styles.benefitIcon}>💰</div>
                            <h3 className={styles.benefitTitle}>{t('referral.commissionTitle')}</h3>
                            <p className={styles.benefitDescription}>
                                {t('referral.commissionDesc')}
                            </p>
                        </div>
                        <div className={styles.benefitCard}>
                            <div className={styles.benefitIcon}>⭐</div>
                            <h3 className={styles.benefitTitle}>{t('referral.vipStatusTitle')}</h3>
                            <p className={styles.benefitDescription}>
                                {t('referral.vipStatusDesc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert Dialog */}
            {alertMessage && (
                <Dialog
                    open={true}
                    onClose={() => setAlertMessage(null)}
                    title={isSuccess ? '✓ Success' : '⚠ Notice'}
                >
                    <p style={{ textAlign: 'center', margin: '1rem 0' }}>{alertMessage}</p>
                </Dialog>
            )}
        </div>
    );
}
