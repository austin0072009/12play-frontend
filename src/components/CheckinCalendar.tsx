import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./CheckinCalendar.module.css";
import { fetchCheckinInfo, checkinToday, claimActivity } from "../services/api";
import { useUserStore } from "../store/user";
import { useAlertStore } from "../store/alert";

interface CheckinDay {
  day: number;
  reward: number;
  checked: boolean;
  is_today: boolean;
}

interface CheckinData {
  todaySigned: boolean;
  totalDays: number;              // days in current round
  availableBonus: number;
  round: number;                  // completed rounds (0-based)
  currentRound: number;           // display round (1-based)
  totalAccumulatedDays: number;   // round * 10 + totalDays
}

export default function CheckinCalendar() {
  const { t } = useTranslation();
  const [data, setData] = useState<CheckinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [claimingBonus, setClaimingBonus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useUserStore((s) => s.token);
  const { showAlert } = useAlertStore();

  useEffect(() => {
    loadCheckinInfo();
  }, [token]);

  const loadCheckinInfo = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetchCheckinInfo();
      console.log("Checkin info:", res);
      if (res?.data) {
        setData(res.data);
      } else if (res && !res.status) {
        // Direct data response
        setData(res);
      }
    } catch (err) {
      console.error("Error loading checkin info:", err);
      setError(t("checkin.errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckinToday = async () => {
    if (!token || checkingIn) return;

    try {
      setCheckingIn(true);
      const res = await checkinToday();
      console.log("Checkin response:", res);
      if (res?.status === 200) {
        // Reload checkin info after successful check-in
        await loadCheckinInfo();
        showAlert(res?.msg || t("checkin.checkInSuccess"));
      } else {
        showAlert(res?.msg || t("checkin.checkInFailed"));
      }
    } catch (err) {
      console.error("Error checking in:", err);
      showAlert(t("checkin.checkInFailed"));
    } finally {
      setCheckingIn(false);
    }
  };

  const handleClaimBonus = async () => {
    if (!token || claimingBonus) return;

    try {
      setClaimingBonus(true);
      const res = await claimActivity(32, 4);
      console.log("Claim bonus response:", res);
      if (res?.status?.errorCode === 0) {
        // Reload checkin info after successful bonus claim
        await loadCheckinInfo();
        showAlert(res?.status?.msg || t("checkin.bonusClaimedSuccess"));
      } else {
        showAlert(res?.status?.msg || res?.status?.mess || t("checkin.bonusClaimFailed"));
      }
    } catch (err) {
      console.error("Error claiming bonus:", err);
      showAlert(t("checkin.bonusClaimFailed"));
    } finally {
      setClaimingBonus(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          {t("checkin.loginPrompt")}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>{t("checkin.loadingInfo")}</div>
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
        <div className={styles.noData}>{t("checkin.noData")}</div>
      </div>
    );
  }

  // Build calendar for current round (show 10 days)
  const checkinDays: CheckinDay[] = [
    { day: 1, reward: 0, checked: data.totalDays >= 1, is_today: data.totalDays === 1 && !data.todaySigned },
    { day: 2, reward: 0, checked: data.totalDays >= 2, is_today: data.totalDays === 2 && !data.todaySigned },
    { day: 3, reward: 300, checked: data.totalDays >= 3, is_today: data.totalDays === 3 && !data.todaySigned },
    { day: 4, reward: 0, checked: data.totalDays >= 4, is_today: data.totalDays === 4 && !data.todaySigned },
    { day: 5, reward: 500, checked: data.totalDays >= 5, is_today: data.totalDays === 5 && !data.todaySigned },
    { day: 6, reward: 0, checked: data.totalDays >= 6, is_today: data.totalDays === 6 && !data.todaySigned },
    { day: 7, reward: 0, checked: data.totalDays >= 7, is_today: data.totalDays === 7 && !data.todaySigned },
    { day: 8, reward: 800, checked: data.totalDays >= 8, is_today: data.totalDays === 8 && !data.todaySigned },
    { day: 9, reward: 0, checked: data.totalDays >= 9, is_today: data.totalDays === 9 && !data.todaySigned },
    { day: 10, reward: 1000, checked: data.totalDays >= 10, is_today: data.totalDays === 10 && !data.todaySigned },
  ];

  const isNewRound = data.totalDays === 0 && data.round > 0;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t("checkin.title")}</h3>
      
      {/* Round & Progress Info */}
      <div className={styles.roundInfo}>
        <div className={styles.roundRow}>
          <div className={styles.roundItem}>
            <span className={styles.roundLabel}>{t("checkin.currentRound")}</span>
            <span className={styles.roundValue}>{data.currentRound}</span>
          </div>
          <div className={styles.roundItem}>
            <span className={styles.roundLabel}>{t("checkin.thisRound")}</span>
            <span className={styles.roundValue}>{data.totalDays} / 10</span>
          </div>
          <div className={styles.roundItem}>
            <span className={styles.roundLabel}>{t("checkin.totalDays")}</span>
            <span className={styles.roundValue}>{data.totalAccumulatedDays}</span>
          </div>
        </div>

        {/* New Round Started Hint */}
        {isNewRound && (
          <div className={styles.newRoundHint}>
            {t("checkin.newRoundStarted")}
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className={styles.calendarGrid}>
        {checkinDays.map((day) => (
          <div
            key={day.day}
            className={`${styles.dayCard} ${day.checked ? styles.checked : ''} ${day.is_today ? styles.today : ''} ${day.reward > 0 ? styles.milestone : ''}`}
          >
            <div className={styles.dayNumber}>{t("checkin.day")} {day.day}</div>
            <div className={styles.rewardIcon}>
              {day.checked ? '✅' : day.reward > 0 ? '⭐' : ''}
            </div>
            {day.reward > 0 ? (
              <>
                <div className={styles.rewardAmount}>
                  {day.reward.toLocaleString()}
                </div>
                <div className={styles.rewardUnit}>MMK</div>
              </>
            ) : (
              <div className={styles.emptyDay}></div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className={styles.actionSection}>
        {data.todaySigned ? (
          <div className={styles.checkedToday}>
            {t("checkin.checkedToday")}
          </div>
        ) : (
          <button 
            className={styles.checkinBtn}
            onClick={handleCheckinToday}
            disabled={checkingIn}
          >
            {checkingIn ? t("checkin.checkingIn") : t("checkin.checkInToday")}
          </button>
        )}
        
        {data.availableBonus > 0 && (
          <button 
            className={styles.bonusBtn}
            onClick={handleClaimBonus}
            disabled={claimingBonus}
          >
            {claimingBonus ? t("checkin.claiming") : t("checkin.claimBonus")}
          </button>
        )}
      </div>
    </div>
  );
}
