import { useNavigate } from "react-router-dom";
import styles from "./Lottery2DHome.module.css";
import {
  ChevronLeftIcon,
  TrophyIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

export default function Lottery2DHome() {
  const navigate = useNavigate();

  const currentRound = {
    drawTime: "16:30",
    status: "OPEN", // OPEN | CLOSED
    countdown: "01:12:45",
  };

  const results = [
    { time: "12:00", result2d: "45" },
    { time: "16:30", result2d: "78" },
    { time: "21:00", result2d: "92" },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>

        <h1 className={styles.title}>2D Lottery</h1>

        <div className={styles.headerActions}>
          <button
            className={styles.iconBtn}
            onClick={() => navigate("/2d/rank")}
            aria-label="Rank"
          >
            <TrophyIcon />
          </button>
          <button
            className={styles.iconBtn}
            onClick={() => navigate("/2d/closed-days")}
            aria-label="Closed Days"
          >
            <CalendarDaysIcon />
          </button>
          <button
            className={styles.iconBtn}
            onClick={() => navigate("/2d/history")}
            aria-label="Bet History"
          >
            <ClipboardDocumentListIcon />
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {/* Current Round */}
        <div className={styles.roundCard}>
          <div>
            <p className={styles.roundLabel}>Next Draw</p>
            <p className={styles.roundTime}>{currentRound.drawTime}</p>
          </div>

          <div className={styles.roundStatus}>
            <ClockIcon className={styles.clockIcon} />
            <span>{currentRound.countdown}</span>
            <span
              className={`${styles.badge} ${
                currentRound.status === "OPEN"
                  ? styles.open
                  : styles.closed
              }`}
            >
              {currentRound.status}
            </span>
          </div>
        </div>

        {/* Latest Result */}
        <div className={styles.lastResult}>
          <p className={styles.lastResultTitle}>Latest Result</p>
          <p className={styles.lastResultValue}>78</p>
          <p className={styles.lastResultTime}>16:30 Draw</p>
        </div>

        {/* Result List */}
        <div className={styles.results}>
          {results.map((r, i) => (
            <div key={i} className={styles.resultCard}>
              <span className={styles.resultTime}>{r.time}</span>
              <span className={styles.result2d}>{r.result2d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bet Button - Floating Action Button */}
      <button
        className={styles.betBtn}
        disabled={currentRound.status !== "OPEN"}
        onClick={() => navigate("/2d/bet")}
        title="Place Bet"
      >
        BET
      </button>
    </div>
  );
}
