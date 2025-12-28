import { useNavigate } from "react-router-dom";
import styles from "./Lottery3DClosedDays.module.css";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

export default function Lottery3DClosedDays() {
  const navigate = useNavigate();

  const closedDays = [
    {
      date: "2025-12-25",
      day: "Wednesday",
      reason: "Christmas Day",
    },
    {
      date: "2025-01-01",
      day: "Wednesday",
      reason: "New Year's Day",
    },
    {
      date: "2025-02-10",
      day: "Monday",
      reason: "Chinese New Year",
    },
    {
      date: "2025-05-01",
      day: "Thursday",
      reason: "Labor Day",
    },
    {
      date: "2025-08-31",
      day: "Sunday",
      reason: "National Day",
    },
    {
      date: "2025-10-24",
      day: "Friday",
      reason: "Deepavali",
    },
  ];

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
          <p>🔴 3D Lottery will be closed on the following days:</p>
        </div>

        <div className={styles.daysList}>
          {closedDays.map((day, idx) => (
            <div key={idx} className={styles.dayCard}>
              <div className={styles.dateSection}>
                <p className={styles.date}>{day.date}</p>
                <p className={styles.dayName}>{day.day}</p>
              </div>
              <div className={styles.reasonSection}>
                <p className={styles.reason}>{day.reason}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <p>Last updated: 2025-12-28</p>
          <p>Please plan your bets accordingly</p>
        </div>
      </div>
    </div>
  );
}
