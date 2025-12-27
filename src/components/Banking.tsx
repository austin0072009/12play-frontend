import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBankList, unBindCard } from "../services/api";
import { useUserStore } from "../store/user";
import Dialog from "./Dialog";
import kbzPayImg from "../assets/kbzpay.jpg?url";
import wavePayImg from "../assets/wavepay.jpg?url";
import styles from "./Banking.module.css";

export default function Banking() {
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
      setSuccessMessage("Bank card deleted successfully!");
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
          <p>Loading bank information...</p>
        </div>
      ) : bankList?.bank_card ? (
        <div className={styles.bankCardSection}>
          <div className={styles.bankCard}>
            {getBankImage(bankList.bank_name) && (
              <img
                src={getBankImage(bankList.bank_name)}
                alt={bankList.bank_name}
                className={styles.bankImage}
              />
            )}
            <div className={styles.bankInfo}>
              <h3 className={styles.bankName}>{bankList.bank_name}</h3>
              <p className={styles.bankUsername}>{bankList.bank_username}</p>
              <p className={styles.bankCardNumber}>{bankList.bank_card}</p>
              <span className={styles.verifiedBadge}>VERIFIED</span>
            </div>
            <div className={styles.bankActions}>
              <button
                className={styles.deleteButton}
                onClick={() => setDeleteConfirm(true)}
                title="Delete Bank Card"
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
          <p className={styles.emptyText}>No bank account added yet</p>
          <p className={styles.emptySubtext}>Add a bank account to enable deposits and withdrawals</p>
        </div>
      )}

      {/* Add Bank Button - Always visible */}
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
          <span>{bankList?.bank_card ? "Change Bank" : "Add Bank Account"}</span>
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title="Delete Bank Card"
      >
        <div className={styles.confirmContent}>
          <p>Are you sure you want to delete this bank card?</p>
          <p className={styles.confirmWarning}>This action cannot be undone.</p>
          <div className={styles.confirmButtons}>
            <button
              className={styles.cancelButton}
              onClick={() => setDeleteConfirm(false)}
            >
              Cancel
            </button>
            <button
              className={styles.confirmButton}
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>

      {/* Success/Error Message Dialog */}
      <Dialog
        open={successDialog}
        onClose={() => setSuccessDialog(false)}
        title="Information"
      >
        {successMessage}
      </Dialog>
    </div>
  );
}
