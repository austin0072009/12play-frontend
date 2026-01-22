import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AddBank } from "../services/api";
import { useUserStore } from "../store/user";
import Dialog from "../components/Dialog";
import kbzPayImg from "../assets/kbzpay.jpg?url";
import wavePayImg from "../assets/wavepay.jpg?url";
import type { BankItem } from "../services/types";
import styles from "./BankAdd.module.css";

export default function BankAdd() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedBank, setSelectedBank] = useState<string | undefined>();
    const [bankUsername, setBankUsername] = useState("");
    const [bankCard, setBankCard] = useState("");
    const [bankCardConfirm, setBankCardConfirm] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [infoDialogShown, setInfoDialogShown] = useState(false);

    const userInfo = useUserStore((state) => state.userInfo);
    const existingBank = userInfo?.banklist?.bank_username;

    const bankList: BankItem[] = [
        { name: "KBZ Pay", img: kbzPayImg, code: "KBZPAY" },
        { name: "Wave Pay", img: wavePayImg, code: "WAVEPAY" },
    ];

    useEffect(() => {
        if (existingBank) setBankUsername(existingBank);
    }, [existingBank]);

    const validateForm = (): boolean => {
        if (!selectedBank) {
            setErrorMessage(t("bankAdd.selectBankError"));
            return false;
        }
        if (!bankUsername.trim()) {
            setErrorMessage(t("bankAdd.enterNameError"));
            return false;
        }
        if (!bankCard.trim()) {
            setErrorMessage(t("bankAdd.enterNumberError"));
            return false;
        }
        if (!bankCardConfirm.trim()) {
            setErrorMessage(t("bankAdd.confirmNumberError"));
            return false;
        }
        if (bankCard !== bankCardConfirm) {
            setErrorMessage(t("bankAdd.numberMismatchError"));
            return false;
        }
        return true;
    };

    const triggerInfoDialogOnce = () => {
        if (!infoDialogShown) {
            setShowInfoDialog(true);
            setInfoDialogShown(true);
        }
    };

    const handleSubmit = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!validateForm()) {
            setShowDialog(true);
            setIsSuccess(false);
            return;
        }

        setSubmitting(true);
        try {
            const res = await AddBank({
                type: 0,
                bank_name: selectedBank || "",
                bank_branch_name: selectedBank || "",
                bank_username: bankUsername,
                bank_card: bankCard,
            });

            if (res && res.status && Number(res.status.errorCode) === 0) {
                setSuccessMessage(t("bankAdd.successMessage"));
                setIsSuccess(true);
                setShowDialog(true);
                setSelectedBank(undefined);
                setTimeout(() => {
                    setShowDialog(false);
                    navigate(-1);
                }, 2000);
            } else {
                const errMsg = res?.status?.mess || res?.status?.msg || t("bankAdd.failedMessage");
                setErrorMessage(errMsg);
                setIsSuccess(false);
                setShowDialog(true);
            }
        } catch (error: any) {
            console.error("=== BANK ADD ERROR ===", error);
            const errMsg =
                error?.response?.data?.status?.mess ||
                error?.response?.data?.status?.msg ||
                error?.message ||
                t("bankAdd.networkError");
            setErrorMessage(errMsg);
            setIsSuccess(false);
            setShowDialog(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDialogClose = () => {
        setShowDialog(false);
        if (isSuccess) {
            navigate(-1);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                    title="Go back"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        width="24px"
                        height="24px"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        ></path>
                    </svg>
                </button>
                <h1 className={styles.title}>{t("bankAdd.title")}</h1>
                <div></div>
            </div>

            <div className={styles.content}>
                <div className={styles.formSection}>
                    <label className={styles.sectionTitle}>{t("bankAdd.selectBank")}</label>
                    <div className={styles.bankGrid}>
                        {bankList.map((bank) => (
                            <div
                                key={bank.code}
                                className={`${styles.bankOption} ${
                                    selectedBank === bank.code ? styles.selected : ""
                                }`}
                                onClick={() => setSelectedBank(bank.code)}
                            >
                                <img src={bank.img} alt={bank.name} className={styles.bankLogo} />
                                <span className={styles.bankName}>{bank.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.formSection}>
                    <label className={styles.label}>{t("bankAdd.accountName")}</label>
                    <input
                        type="text"
                        value={bankUsername}
                        onFocus={triggerInfoDialogOnce}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[^0-9]*$/.test(value)) {
                                setBankUsername(value);
                            }
                        }}
                        disabled={!!existingBank}
                        placeholder={t("bankAdd.enterFullName")}
                        className={styles.input}
                    />
                    {existingBank && (
                        <p className={styles.helpText}>{t("bankAdd.accountNameLocked")}</p>
                    )}
                </div>

                <div className={styles.formSection}>
                    <label className={styles.label}>{t("bankAdd.accountNumber")}</label>
                    <input
                        type="text"
                        value={bankCard}
                        onFocus={triggerInfoDialogOnce}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[0-9]*$/.test(value)) {
                                setBankCard(value);
                            }
                        }}
                        placeholder={t("bankAdd.enterAccountNumber")}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formSection}>
                    <label className={styles.label}>{t("bankAdd.confirmAccountNumber")}</label>
                    <input
                        type="text"
                        value={bankCardConfirm}
                        onFocus={triggerInfoDialogOnce}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[0-9]*$/.test(value)) {
                                setBankCardConfirm(value);
                            }
                        }}
                        placeholder={t("bankAdd.reenterAccountNumber")}
                        className={styles.input}
                    />
                </div>

            </div>

            <div className={styles.actionContainer}>
                <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <span className={styles.spinner}></span>
                            {t("bankAdd.submitting")}
                        </>
                    ) : (
                        t("bankAdd.submit")
                    )}
                </button>
            </div>

            <Dialog
                open={showDialog}
                onClose={handleDialogClose}
                title={isSuccess ? t("bankAdd.success") : t("bankAdd.error")}
            >
                <div className={styles.dialogContent}>
                    {isSuccess ? (
                        <div className={styles.successContent}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                width="48px"
                                height="48px"
                                className={styles.successIcon}
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 6L9 17l-5-5"
                                ></path>
                            </svg>
                            <p>{successMessage}</p>
                        </div>
                    ) : (
                        <div className={styles.errorContent}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                width="48px"
                                height="48px"
                                className={styles.errorIcon}
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v6m0 3v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </div>
            </Dialog>

            <Dialog
                open={showInfoDialog}
                onClose={() => setShowInfoDialog(false)}
                title={t("bankAdd.notice")}
            >
                <div className={styles.dialogContent}>
                    <div className={styles.errorContent} style={{ gap: '1rem', alignItems: 'flex-start' }}>
                        {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            width="36px"
                            height="36px"
                            className={styles.errorIcon}
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v6m0 3v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg> */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem'}}>
                            {/* <p>{t("bankAdd.noticeText")}</p> */}
                            <p style={{fontSize:'1.5rem'}}>{t("bankAdd.noticeText2")}</p>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
