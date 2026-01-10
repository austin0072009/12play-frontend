import { useEffect, useState } from "react";
import styles from "./FirstDepositBonus.module.css";
import { fetchDepositBonusInfo, claimActivity } from "../services/api";
import { useUserStore } from "../store/user";

interface DepositBonusData {
  bonus_amount: number;
  current_turnover: number;
  required_turnover: number;
  is_applied: boolean;
  deposit_amount: number;
  status: string; // 'pending' | 'applied' | 'completed'
}

export default function FirstDepositBonus() {
  const [data, setData] = useState<DepositBonusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useUserStore((s) => s.token);

  useEffect(() => {
    loadBonusInfo();
  }, [token]);

  const loadBonusInfo = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetchDepositBonusInfo();
      console.log("Deposit bonus info:", res);
      if (res?.data) {
        setData(res.data);
      } else if (res && !res.status) {
        // Direct data response
        setData(res);
      }
    } catch (err) {
      console.error("Error loading deposit bonus info:", err);
      setError("Failed to load bonus information");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!token || applying) return;

    try {
      setApplying(true);
      const res = await claimActivity(29, 2);
      console.log("Apply response:", res);
      if (res?.status?.errorCode === 0) {
        // Reload bonus info after successful apply
        await loadBonusInfo();
        alert("Bonus applied successfully! Complete the turnover to withdraw.");
      } else {
        alert(res?.status?.msg || res?.status?.mess || "Failed to apply bonus");
      }
    } catch (err) {
      console.error("Error applying bonus:", err);
      alert("Failed to apply bonus");
    } finally {
      setApplying(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          Please login to view your bonus progress
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading bonus information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>No bonus information available</div>
      </div>
    );
  }

  const progress = data.required_turnover > 0 
    ? Math.min((data.current_turnover / data.required_turnover) * 100, 100) 
    : 0;
  const isComplete = progress >= 100;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>🎁 First Deposit Bonus - 100% Match</h3>
      
      {/* Bonus Summary */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryRow}>
          <span className={styles.label}>Deposit Amount</span>
          <span className={styles.value}>{data.deposit_amount?.toLocaleString() || 0} MMK</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.label}>Bonus Amount (100%)</span>
          <span className={styles.bonusValue}>{data.bonus_amount?.toLocaleString() || 0} MMK</span>
        </div>
      </div>

      {/* Turnover Progress - Only show after bonus is applied */}
      {data.is_applied && (
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Turnover Progress</span>
            <span className={styles.progressPercent}>{progress.toFixed(1)}%</span>
          </div>
          
          <div className={styles.progressBarWrapper}>
            <div 
              className={`${styles.progressBar} ${isComplete ? styles.complete : ''}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className={styles.progressDetails}>
            <span className={styles.progressCurrent}>
              {data.current_turnover?.toLocaleString() || 0}
            </span>
            <span className={styles.progressDivider}>/</span>
            <span className={styles.progressRequired}>
              {data.required_turnover?.toLocaleString() || 0} MMK
            </span>
          </div>
          
          {isComplete && (
            <div className={styles.completeMessage}>
              ✅ Turnover completed! You can now withdraw your bonus.
            </div>
          )}
        </div>
      )}

      {/* Status & Apply Button */}
      <div className={styles.statusSection}>
        {data.is_applied ? (
          <div className={styles.appliedBadge}>
            ✅ Bonus Applied
          </div>
        ) : (
          <button 
            className={styles.applyBtn}
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? "Applying..." : "💰 Apply for Bonus"}
          </button>
        )}
      </div>

      {/* Info Message */}
      {!data.is_applied && (
        <div className={styles.infoBox}>
          <p>Click "Apply for Bonus" to receive your 100% bonus. After applying, you must complete the turnover requirement before you can withdraw.</p>
        </div>
      )}
    </div>
  );
}
