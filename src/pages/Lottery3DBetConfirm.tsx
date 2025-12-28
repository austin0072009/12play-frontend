import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Lottery3DBetConfirm.module.css";
import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

export default function Lottery3DBetConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/3d/bet-success", { state });
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>Confirm Bet</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.confirmCard}>
          <h2 className={styles.cardTitle}>Bet Details</h2>

          <div className={styles.detailRow}>
            <span className={styles.label}>3D Number</span>
            <span className={styles.value}>{state.selectedNumber}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Set</span>
            <span className={styles.value}>{state.selectedSet}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Payout</span>
            <span className={styles.value}>{state.selectedPayout}</span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Bet Amount</span>
            <span className={`${styles.value} ${styles.amount}`}>
              MYR {state.betAmount}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Potential Win</span>
            <span className={`${styles.value} ${styles.win}`}>
              MYR{" "}
              {(
                parseFloat(state.betAmount) *
                parseFloat(state.selectedPayout?.slice(0, -1) || 0)
              ).toFixed(2)}
            </span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.notice}>
            <p>
              ⚠️ Please verify all details before confirming. Once submitted, the bet
              cannot be cancelled.
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Bet"}
          </button>
        </div>
      </div>
    </div>
  );
}
