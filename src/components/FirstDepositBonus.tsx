import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./FirstDepositBonus.module.css";
import { fetchDepositBonusInfo, claimActivity } from "../services/api";
import { useUserStore } from "../store/user";
import { useAlertStore } from "../store/alert";

interface DepositBonusData {
  bonusAmount: number;
  bonusReceived: boolean;
  progress: string;
  todayDeposit: string;
  turnoverLeft: number;
  turnoverNeed: number;
}

export default function FirstDepositBonus() {
  const { t } = useTranslation();
  const [data, setData] = useState<DepositBonusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useUserStore((s) => s.token);
  const { showAlert } = useAlertStore();

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
      setError(t("bonus.errorLoading"));
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
        showAlert(t("bonus.applySuccess"));
      } else {
        showAlert(res?.status?.msg || res?.status?.mess || t("bonus.applyFailed"));
      }
    } catch (err) {
      console.error("Error applying bonus:", err);
      showAlert(t("bonus.applyFailed"));
    } finally {
      setApplying(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          {t("bonus.loginPrompt")}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>{t("bonus.loadingInfo")}</div>
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
        <div className={styles.noData}>{t("bonus.noData")}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t("bonus.title")}</h3>
      
      {/* Bonus Summary */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryRow}>
          <span className={styles.label}>{t("bonus.todaysDeposit")}</span>
          <span className={styles.value}>{Number(data.todayDeposit).toLocaleString()} MMK</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.label}>{t("bonus.bonusAmount")}</span>
          <span className={styles.bonusValue}>{Number(data.bonusAmount).toLocaleString()} MMK</span>
        </div>
      </div>

      {/* Turnover Progress - Only show after bonus is applied */}
      {data.bonusReceived && (
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>{t("bonus.turnoverProgress")}</span>
            <span className={styles.progressPercent}>{data.progress}</span>
          </div>
          
          <div className={styles.progressBarWrapper}>
            <div 
              className={`${styles.progressBar} ${data.turnoverLeft === 0 ? styles.complete : ''}`}
              style={{ width: data.progress }}
            />
          </div>
          
          <div className={styles.progressDetails}>
            <span className={styles.progressCurrent}>
              {(data.turnoverNeed - data.turnoverLeft).toLocaleString()}
            </span>
            <span className={styles.progressDivider}>/</span>
            <span className={styles.progressRequired}>
              {data.turnoverNeed.toLocaleString()} MMK
            </span>
          </div>
          
          {data.turnoverLeft === 0 && (
            <div className={styles.completeMessage}>
              {t("bonus.turnoverCompleted")}
            </div>
          )}
        </div>
      )}

      {/* Status & Apply Button */}
      <div className={styles.statusSection}>
        {data.bonusReceived ? (
          <div className={styles.appliedBadge}>
            {t("bonus.bonusApplied")}
          </div>
        ) : (
          <button 
            className={styles.applyBtn}
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? t("bonus.applying") : t("bonus.applyForBonus")}
          </button>
        )}
      </div>

      {/* Info Message */}
      {!data.bonusReceived && (
        <div className={styles.infoBox}>
          <p>{t("bonus.infoMessage")}</p>
        </div>
      )}
    </div>
  );
}
