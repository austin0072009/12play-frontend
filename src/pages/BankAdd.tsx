import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddBank } from "../services/api";
import { useUserStore } from "../store/user";
import Dialog from "../components/Dialog";
import kbzPayImg from "../assets/kbzpay.jpg?url";
import wavePayImg from "../assets/wavepay.jpg?url";
import type { BankItem } from "../services/types";
import styles from "./BankAdd.module.css";

export default function BankAdd() {
    const navigate = useNavigate();
    const [selectedBank, setSelectedBank] = useState<string | undefined>();
    const [bankUsername, setBankUsername] = useState("");
    const [bankCard, setBankCard] = useState("");
    const [bankCardConfirm, setBankCardConfirm] = useState("");
    const [qrFile, setQrFile] = useState<File | undefined>();
    const [qrPreview, setQrPreview] = useState<string | undefined>();
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const userInfo = useUserStore((state) => state.userInfo);
    const existingBank = userInfo?.banklist?.bank_username;

    const bankList: BankItem[] = [
        { name: "KBZ Pay", img: kbzPayImg, code: "KBZPAY" },
        { name: "Wave Pay", img: wavePayImg, code: "WAVEPAY" },
    ];

    useEffect(() => {
        if (existingBank) setBankUsername(existingBank);
    }, [existingBank]);

    useEffect(() => {
        if (qrFile) {
            const u = URL.createObjectURL(qrFile);
            setQrPreview(u);
            return () => URL.revokeObjectURL(u);
        } else {
            setQrPreview(undefined);
        }
    }, [qrFile]);

    const validateForm = (): boolean => {
        if (!selectedBank) {
            setErrorMessage("Please select a bank");
            return false;
        }
        if (!bankUsername.trim()) {
            setErrorMessage("Please enter account name");
            return false;
        }
        if (!bankCard.trim()) {
            setErrorMessage("Please enter account number");
            return false;
        }
        if (!bankCardConfirm.trim()) {
            setErrorMessage("Please confirm account number");
            return false;
        }
        if (bankCard !== bankCardConfirm) {
            setErrorMessage("Account numbers do not match");
            return false;
        }
        if (!qrFile) {
            setErrorMessage("Please upload QR code");
            return false;
        }
        return true;
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
            console.log("=== SUBMITTING BANK ADD ===", {
                bank_name: selectedBank,
                bank_username: bankUsername,
                bank_card: bankCard,
            });

            const res = await AddBank({
                type: 0,
                bank_name: selectedBank || "",
                bank_branch_name: selectedBank || "",
                bank_username: bankUsername,
                bank_card: bankCard,
                qr_code: qrFile || undefined,
            });

            console.log("=== BANK ADD RESPONSE ===", res);

            if (res && res.status && Number(res.status.errorCode) === 0) {
                setSuccessMessage("Bank account added successfully!");
                setIsSuccess(true);
                setShowDialog(true);
                // Reset form
                setSelectedBank(undefined);
                setQrFile(undefined);
                // Navigate after showing success
                setTimeout(() => {
                    setShowDialog(false);
                    navigate(-1);
                }, 2000);
            } else {
                const errMsg = res?.status?.mess || res?.status?.msg || "Failed to add bank account";
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
                "Network error. Please try again.";
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
            {/* Header */}
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
                <h1 className={styles.title}>Add Bank Account</h1>
                <div></div>
            </div>

            <div className={styles.content}>
                {/* Select Bank */}
                <div className={styles.formSection}>
                    <label className={styles.sectionTitle}>Select Bank</label>
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

                {/* Account Name */}
                <div className={styles.formSection}>
                    <label className={styles.label}>Account Name</label>
                    <input
                        type="text"
                        value={bankUsername}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Only allow letters and spaces (no numbers)
                            if (/^[^0-9]*$/.test(value)) {
                                setBankUsername(value);
                            }
                        }}
                        disabled={!!existingBank}
                        placeholder="Enter your full name"
                        className={styles.input}
                    />
                    {existingBank && (
                        <p className={styles.helpText}>Account name is locked (already set)</p>
                    )}
                </div>

                {/* Account Number */}
                <div className={styles.formSection}>
                    <label className={styles.label}>Account Number</label>
                    <input
                        type="text"
                        value={bankCard}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numbers
                            if (/^[0-9]*$/.test(value)) {
                                setBankCard(value);
                            }
                        }}
                        placeholder="Enter your account number"
                        className={styles.input}
                    />
                </div>

                {/* Confirm Account Number */}
                <div className={styles.formSection}>
                    <label className={styles.label}>Confirm Account Number</label>
                    <input
                        type="text"
                        value={bankCardConfirm}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numbers
                            if (/^[0-9]*$/.test(value)) {
                                setBankCardConfirm(value);
                            }
                        }}
                        placeholder="Re-enter your account number"
                        className={styles.input}
                    />
                </div>

                {/* QR Code Upload */}
                <div className={styles.formSection}>
                    <label className={styles.label}>Upload QR Code</label>
                    <div
                        className={styles.qrUploadArea}
                        onClick={() => document.getElementById("qr-upload")?.click()}
                    >
                        {qrPreview ? (
                            <div className={styles.qrPreview}>
                                <img src={qrPreview} alt="QR Code Preview" />
                                <p className={styles.qrLabel}>Click to change QR code</p>
                            </div>
                        ) : (
                            <div className={styles.qrPlaceholder}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    width="48px"
                                    height="48px"
                                    className={styles.uploadIcon}
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 5v14m7-7H5"
                                    ></path>
                                </svg>
                                <p className={styles.uploadText}>Click to upload QR code</p>
                                <p className={styles.uploadSubtext}>or drag and drop</p>
                            </div>
                        )}
                        <input
                            id="qr-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) setQrFile(f);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className={styles.actionContainer}>
                <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <span className={styles.spinner}></span>
                            Submitting...
                        </>
                    ) : (
                        "Submit"
                    )}
                </button>
            </div>

            {/* Dialog for errors/success */}
            <Dialog
                open={showDialog}
                onClose={handleDialogClose}
                title={isSuccess ? "Success" : "Error"}
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
        </div>
    );
}
