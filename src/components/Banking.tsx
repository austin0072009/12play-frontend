import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchBankList, unBindCard } from "../services/api";
import { useUserStore } from "../store/user";
import Dialog from "./Dialog";
import kbzPayImg from "../assets/kbzpay.jpg?url";
import wavePayImg from "../assets/wavepay.jpg?url";
import styles from "./Banking.module.css";

export default function Banking() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bankList, setBankList] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successDialog, setSuccessDialog] = useState(false);

  useEffect(() => {
    loadBankList();
  }, []);

  const loadBankList = async () => {
    try {
      setIsLoading(true);
      const response = await fetchBankList();
      console.log("=== BANK LIST RESPONSE ===", response);
      if (response && response.data) {
        setBankList(response.data);
        const setUserInfo = useUserStore.getState().setUserInfo;
        const currentUserInfo = useUserStore.getState().userInfo;
        setUserInfo({ ...currentUserInfo, banklist: response.data });
      }
    } catch (error) {
      console.error("Failed to fetch bank list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBank = () => {
    navigate("/bank/add");
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await unBindCard();
      console.log("=== DELETE BANK RESPONSE ===", response);
      setDeleteConfirm(false);
      setSuccessMessage(t('banking.deleteSuccess'));
      setSuccessDialog(true);
      // Reload bank list after deletion
      setTimeout(() => {
        loadBankList();
        setSuccessDialog(false);
      }, 1500);
    } catch (error: any) {
      console.error("Failed to delete bank card:", error);
      const errorMsg =
        error?.response?.data?.status?.mess ||
        error?.response?.data?.status?.msg ||
        "Failed to delete bank card. Please try again.";
      setSuccessMessage(errorMsg);
      setSuccessDialog(true);
      setDeleteConfirm(false);
    }
  };

  const getBankImage = (bankName: string) => {
    switch (bankName) {
      case "KBZPAY":
        return kbzPayImg;
      case "WAVEPAY":
        return wavePayImg;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>{t('banking.loadingBank')}</p>
        </div>
      ) : bankList?.bank_card ? (
        <div className={styles.bankCardSection}>
          <div className={styles.bankCard}>
            {getBankImage(bankList.bank_name) && (
              <img
                src={getBankImage(bankList.bank_name) || ""}
                alt={bankList.bank_name}
                className={styles.bankImage}
              />
            )}
            <div className={styles.bankInfo}>
              <h3 className={styles.bankName}>{bankList.bank_name || ""}</h3>
              <p className={styles.bankUsername}>{bankList.bank_username || ""}</p>
              <p className={styles.bankCardNumber}>{bankList.bank_card || ""}</p>
              <span className={styles.verifiedBadge}>{t('banking.verifiedBadge')}</span>
            </div>
            <div className={styles.bankActions}>
              <button
                className={styles.deleteButton}
                onClick={() => setDeleteConfirm(true)}
                title={t('banking.deleteTooltip')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="20px"
                  height="20px"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v5m4-5v5M9.172 3h5.656a2 2 0 0 1 1.97 2.5l-.164.987H7.366l-.164-.987A2 2 0 0 1 9.172 3Z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="64px"
            height="64px"
            className={styles.emptyIcon}
          >
            <g clipPath="url(#CreditCard_svg__a)">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z"
              ></path>
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2 10h20"
              ></path>
            </g>
            <defs>
              <clipPath id="CreditCard_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <p className={styles.emptyText}>{t('banking.noAccountAdded')}</p>
          <p className={styles.emptySubtext}>{t('banking.addAccountInfo')}</p>
        </div>
      )}

      {/* Add Bank Button - Only visible if no bank is bound */}
      {!bankList?.bank_card && (
        <div className={styles.actionButtonContainer}>
          <button className={styles.addBankButton} onClick={handleAddBank}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="20px"
              height="20px"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v14m7-7H5"
              ></path>
            </svg>
            <span>{t('banking.addBankButton')}</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title={t('banking.deleteConfirmTitle')}
      >
        <div className={styles.confirmContent}>
          <p>{t('banking.deleteConfirmMessage')}</p>
          <p className={styles.confirmWarning}>{t('banking.deleteWarning')}</p>
          <div className={styles.confirmButtons}>
            <button
              className={styles.cancelButton}
              onClick={() => setDeleteConfirm(false)}
            >
              {t('banking.cancelButton')}
            </button>
            <button
              className={styles.confirmButton}
              onClick={handleDeleteConfirm}
            >
              {t('banking.deleteButton')}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Success/Error Message Dialog */}
      <Dialog
        open={successDialog}
        onClose={() => setSuccessDialog(false)}
        title={t('banking.successTitle')}
      >
        {successMessage}
      </Dialog>
    </div>
  );
}
