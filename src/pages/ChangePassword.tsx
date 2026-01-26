import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/user';
import { resetPassword } from '../services/auth';
import Dialog from '../components/Dialog';
import styles from './ChangePassword.module.css';

export default function ChangePassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userInfo = useUserStore((s) => s.userInfo);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false,
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const isValidPassword = (pwd: string) => pwd.length >= 6;

    const handleSubmit = async (e: React.FormEvent) => {
        //console.log("submit password change");
        e.preventDefault();

        // Validation
        if (!oldPassword.trim()) {
            //console.log('Error: Old password is empty');
            setAlertMessage(t('changePassword.emptyOldPassword'));
            setAlertOpen(true);
            return;
        }

        if (!newPassword.trim()) {
            //console.log('Error: New password is empty');
            setAlertMessage(t('changePassword.emptyNewPassword'));
            setAlertOpen(true);
            return;
        }

        if (!isValidPassword(newPassword)) {
            //console.log('Error: New password too short');
            setAlertMessage(t('changePassword.invalidPassword'));
            setAlertOpen(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            //console.log('Error: Passwords do not match');
            setAlertMessage(t('changePassword.passwordMismatch'));
            setAlertOpen(true);
            return;
        }

        if (oldPassword === newPassword) {
            //console.log('Error: Old and new password are the same');
            setAlertMessage(t('changePassword.samePassword'));
            setAlertOpen(true);
            return;
        }

        try {
            setIsLoading(true);

            const username = (userInfo as any)?.username || (userInfo as any)?.user_name || (userInfo as any)?.name;

            //console.log('Account username:', { username });

            if (!username) {
                //console.log('Error: No username found');
                setAlertMessage(t('changePassword.noUsername'));
                setAlertOpen(true);
                return;
            }

            const payload: any = {
                name: username,
                old_password: oldPassword,
                password: newPassword,
            };

            //console.log('Sending payload:', payload);

            const response = await resetPassword(payload);

            //console.log('Response:', response);

            if (response && response.status && response.status.errorCode === 0) {
                //console.log('Password changed successfully');
                setAlertMessage(t('changePassword.success'));
                setIsSuccess(true);
                setAlertOpen(true);
                // Reset form
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                // Handle error response
                const errorMsg = response?.status?.mess || response?.status?.msg || t('changePassword.failed');
                //console.log('Password change failed:', errorMsg);
                setAlertMessage(errorMsg);
                setAlertOpen(true);
            }
        } catch (err: any) {
            console.error('Error changing password:', err);
            const errorMsg =
                err?.response?.data?.status?.mess ||
                err?.response?.data?.status?.msg ||
                err?.response?.data?.message ||
                err?.message ||
                t('changePassword.failed');
            //console.log('Setting error message:', errorMsg);
            setAlertMessage(errorMsg);
            setAlertOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const handleDialogClose = () => {
        setAlertOpen(false);
        // Redirect to profile if password change was successful
        if (isSuccess) {
            navigate('/profile');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('changePassword.title')}</h1>
                <p className={styles.subtitle}>{t('changePassword.subtitle')}</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Old Password */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('changePassword.oldPassword')}</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPasswords.old ? 'text' : 'password'}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder={t('changePassword.oldPasswordPlaceholder')}
                                autoComplete="current-password"
                                className={styles.input}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPasswords({
                                        ...showPasswords,
                                        old: !showPasswords.old,
                                    })
                                }
                                className={styles.toggleButton}
                                tabIndex={-1}
                            >
                                {showPasswords.old ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('changePassword.newPassword')}</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder={t('changePassword.newPasswordPlaceholder')}
                                autoComplete="new-password"
                                className={styles.input}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPasswords({
                                        ...showPasswords,
                                        new: !showPasswords.new,
                                    })
                                }
                                className={styles.toggleButton}
                                tabIndex={-1}
                            >
                                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('changePassword.confirmPassword')}</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={t('changePassword.confirmPasswordPlaceholder')}
                                autoComplete="new-password"
                                className={styles.input}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPasswords({
                                        ...showPasswords,
                                        confirm: !showPasswords.confirm,
                                    })
                                }
                                className={styles.toggleButton}
                                tabIndex={-1}
                            >
                                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className={styles.cancelButton}
                        >
                            {t('changePassword.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={styles.submitButton}
                        >
                            {isLoading ? t('changePassword.submitting') : t('changePassword.submit')}
                        </button>
                    </div>
                </form>
            </div>

            <Dialog 
                open={alertOpen} 
                onClose={handleDialogClose}
                title={t('common.alert')}
            >
                {alertMessage}
            </Dialog>
        </div>
    );
}
