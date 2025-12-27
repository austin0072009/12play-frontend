import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';
import { resetPassword } from '../services/auth';
import Dialog from '../components/Dialog';
import styles from './ChangePassword.module.css';

export default function ChangePassword() {
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
        console.log("submit password change");
        e.preventDefault();

        // Validation
        if (!oldPassword.trim()) {
            console.log('Error: Old password is empty');
            setAlertMessage('Please enter your old password');
            setAlertOpen(true);
            return;
        }

        if (!newPassword.trim()) {
            console.log('Error: New password is empty');
            setAlertMessage('Please enter your new password');
            setAlertOpen(true);
            return;
        }

        if (!isValidPassword(newPassword)) {
            console.log('Error: New password too short');
            setAlertMessage('New password must be at least 6 characters');
            setAlertOpen(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            console.log('Error: Passwords do not match');
            setAlertMessage('Passwords do not match');
            setAlertOpen(true);
            return;
        }

        if (oldPassword === newPassword) {
            console.log('Error: Old and new password are the same');
            setAlertMessage('New password must be different from old password');
            setAlertOpen(true);
            return;
        }

        try {
            setIsLoading(true);

            const username = (userInfo as any)?.username || (userInfo as any)?.user_name || (userInfo as any)?.name;

            console.log('Account username:', { username });

            if (!username) {
                console.log('Error: No username found');
                setAlertMessage('Unable to identify account information');
                setAlertOpen(true);
                return;
            }

            const payload: any = {
                name: username,
                old_password: oldPassword,
                password: newPassword,
            };

            console.log('Sending payload:', payload);

            const response = await resetPassword(payload);

            console.log('Response:', response);

            if (response && response.status && response.status.errorCode === 0) {
                console.log('Password changed successfully');
                setAlertMessage('Password changed successfully!');
                setIsSuccess(true);
                setAlertOpen(true);
                // Reset form
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                // Handle error response
                const errorMsg = response?.status?.mess || response?.status?.msg || 'Failed to change password. Please try again.';
                console.log('Password change failed:', errorMsg);
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
                'Failed to change password. Please try again.';
            console.log('Setting error message:', errorMsg);
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
                <h1 className={styles.title}>Change Password</h1>
                <p className={styles.subtitle}>Update your account password</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Old Password */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Old Password</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPasswords.old ? 'text' : 'password'}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Enter your current password"
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
                        <label className={styles.label}>New Password</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min. 6 characters)"
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
                        <label className={styles.label}>Confirm Password</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
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
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={styles.submitButton}
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>

            <Dialog 
                open={alertOpen} 
                onClose={handleDialogClose}
                title="Alert"
            >
                {alertMessage}
            </Dialog>
        </div>
    );
}
