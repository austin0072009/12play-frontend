import { useNavigate } from "react-router-dom";
import styles from "./Lottery2DClosedDays.module.css";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { getClosedDays } from "../services/lottery";
import { useLotteryStore } from "../store/lottery";
import type { ClosedDay } from "../services/types";

export default function Lottery2DClosedDays() {
  const navigate = useNavigate();
  const { lotteryToken } = useLotteryStore();
  const [closedDays, setClosedDays] = useState<ClosedDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClosedDays = async () => {
      if (!lotteryToken) {
        setError("Please login to view closed days");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getClosedDays(1); // 1 = 2D game
        setClosedDays(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load closed days");
      } finally {
        setLoading(false);
      }
    };

    fetchClosedDays();
  }, [lotteryToken]);

  // Helper to get day name from day number (1=Monday, 7=Sunday)
  const getDayName = (day: number): string => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days[day - 1] || "Unknown";
  };

  // Separate closed days by type
  const specificDates = closedDays.filter(day => day.type === 2 && day.date);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>Closed Days</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.notice}>
          <p>🔴 2D Lottery will be closed on the following days:</p>
        </div>

        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && (
          <>
            {/* Recurring Days (Weekly)
            {recurringDays.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>🔁 Recurring Closed Days</h2>
                <div className={styles.daysList}>
                  {recurringDays.map((day, idx) => (
                    <div key={idx} className={styles.dayCard}>
                      <div className={styles.dateSection}>
                        <p className={styles.dayName}>Every {getDayName(day.day!)}</p>
                      </div>
                      <div className={styles.reasonSection}>
                        <p className={styles.reason}>{day.remark || "Closed Day"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Specific Dates */}
            {specificDates.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>📅 Specific Closed Dates</h2>
                <div className={styles.daysList}>
                  {specificDates.map((day, idx) => (
                    <div key={idx} className={styles.dayCard}>
                      <div className={styles.dateSection}>
                        <p className={styles.date}>{day.date}</p>
                        {day.day && <p className={styles.dayName}>{getDayName(day.day)}</p>}
                      </div>
                      <div className={styles.reasonSection}>
                        <p className={styles.reason}>{day.remark || "Holiday"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className={styles.footer}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Please plan your bets accordingly</p>
        </div>
      </div>
    </div>
  );
}
