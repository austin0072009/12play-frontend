import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Feedback.module.css';
import { postFeedback } from '../services/api';
import { useUserStore } from '../store/user';
import Dialog from '../components/Dialog';

export default function Feedback() {
    const navigate = useNavigate();
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
                const msg = res?.data?.msg || res?.msg || 'Feedback submitted successfully!';
                setFeedback('');
                setIsSuccess(true);
                setAlertMessage(msg);
            } else {
                const msg = res?.msg || 'Failed to submit feedback. Please try again.';
                setIsSuccess(false);
                setAlertMessage(msg);
            }

        } catch (error) {
            console.error('Error submitting feedback:', error);
            setIsSuccess(false);
            setAlertMessage('Failed to submit feedback. Please try again.');
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
                <h1 className={styles.title}>Feedback</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.infoCard}>
                    <div className={styles.iconWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <h2 className={styles.infoTitle}>We'd Love to Hear From You!</h2>
                    <p className={styles.infoDescription}>
                        Your feedback helps us improve. Share your thoughts, suggestions, or report any issues you've encountered.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="message" className={styles.label}>
                            Your Message
                        </label>
                        <textarea
                            id="message"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Tell us what's on your mind..."
                            className={styles.textarea}
                            rows={8}
                            maxLength={1000}
                            disabled={isSubmitting}
                        />
                        <div className={styles.charCount}>
                            {feedback.length}/1000
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
                                Sending...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                                Submit Feedback
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
                        Need urgent assistance? Contact our support team via Live Chat.
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
                title="Feedback"
            >
                {alertMessage}
            </Dialog>
        </div>
    );
}
