import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Feedback.module.css';
import { postFeedback } from '../services/api';
import { useUserStore } from '../store/user';
import Dialog from '../components/Dialog';
import { useTranslation } from 'react-i18next';

export default function Feedback() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userInfo = useUserStore((s) => s.userInfo);

    // Alert state
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        setIsSubmitting(true);

        // Retrieve phone/identity from userInfo
        const phone = (userInfo as any)?.phone || (userInfo as any)?.name || (userInfo as any)?.email || '';

        try {
            const res = await postFeedback({
                type: '1',
                content: feedback,
                phone: phone
            });

                if (res?.status?.errorCode === 0 || res?.status === 0 || res?.code === 0) {
                const msg = res?.data?.msg || res?.msg || t('feedback.successDefault');
                setFeedback('');
                setIsSuccess(true);
                setAlertMessage(msg);
            } else {
                const msg = res?.msg || t('feedback.failureDefault');
                setIsSuccess(false);
                setAlertMessage(msg);
            }

        } catch (error) {
            console.error('Error submitting feedback:', error);
            setIsSuccess(false);
            setAlertMessage(t('feedback.failureDefault'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <h1 className={styles.title}>{t('feedback.title')}</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.infoCard}>
                    <div className={styles.iconWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <h2 className={styles.infoTitle}>{t('feedback.infoTitle')}</h2>
                    <p className={styles.infoDescription}>
                        {t('feedback.infoDescription')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="message" className={styles.label}>
                            {t('feedback.labelMessage')}
                        </label>
                        <textarea
                            id="message"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder={t('feedback.placeholder')}
                            className={styles.textarea}
                            rows={8}
                            maxLength={1000}
                            disabled={isSubmitting}
                        />
                        <div className={styles.charCount}>
                            {t('feedback.charCount', { count: feedback.length })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !feedback.trim()}
                        className={styles.submitButton}
                    >
                            {isSubmitting ? (
                            <>
                                <span className={styles.spinner}></span>
                                {t('feedback.sending')}
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                                {t('feedback.submit')}
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.contactInfo}>
                    <p className={styles.contactText}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        {t('feedback.contactInfo')}
                    </p>
                </div>
            </div>

            <Dialog
                open={!!alertMessage}
                onClose={() => {
                    setAlertMessage(null);
                    if (isSuccess) {
                        navigate(-1);
                    }
                }}
                title={t('feedback.dialogTitle')}
            >
                {alertMessage}
            </Dialog>
        </div>
    );
}
