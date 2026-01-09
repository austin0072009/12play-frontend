import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Lottery2DClosedDays.module.css";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { getClosedDays } from "../services/lottery";
import { useLotteryStore } from "../store/lottery";
import type { ClosedDay } from "../services/types";
import { getMyanmarDateString } from "../utils/myanmarTime";

export default function Lottery2DClosedDays() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lotteryToken } = useLotteryStore();
  const [closedDays, setClosedDays] = useState<ClosedDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClosedDays = async () => {
      if (!lotteryToken) {
        setError(t("lottery2d.pleaseLogin"));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getClosedDays(1); // 1 = 2D game
        setClosedDays(data);
      } catch (err: any) {
        setError(err?.message || t("lottery2d.failedLoadClosedDays"));
      } finally {
        setLoading(false);
      }
    };

    fetchClosedDays();
  }, [lotteryToken]);

  // Helper to get day name from day number (1=Monday, 7=Sunday)
  const getDayName = (day: number): string => {
    const days = [
      t("lottery2d.monday"),
      t("lottery2d.tuesday"),
      t("lottery2d.wednesday"),
      t("lottery2d.thursday"),
      t("lottery2d.friday"),
      t("lottery2d.saturday"),
      t("lottery2d.sunday"),
    ];
    return days[day - 1] || t("lottery2d.unknown");
  };

  // Separate closed days by type
  const specificDates = closedDays.filter(day => day.type === 2 && day.date);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>{t("lottery2d.closedDays")}</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.notice}>
          <p>{t("lottery2d.closedNotice")}</p>
        </div>

        {loading && <div className={styles.loading}>{t("common.loading")}</div>}
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
                <h2 className={styles.sectionTitle}>{t("lottery2d.specificClosedDates")}</h2>
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
          <p>{t("lottery2d.lastUpdated")}: {getMyanmarDateString()}</p>
          <p>{t("lottery2d.planBetsAccordingly")}</p>
        </div>
      </div>
    </div>
  );
}
