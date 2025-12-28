import { useNavigate } from "react-router-dom";
import styles from "./Lottery3DHome.module.css";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

export default function Lottery3DHome() {
  const navigate = useNavigate();

  // Mock lottery results data
  const results = [
    {
      time: "12:00 PM",
      set: "SET1",
      value: "100",
      result3d: "456",
    },
    {
      time: "4:30 PM",
      set: "SET2",
      value: "200",
      result3d: "789",
    },
    {
      time: "9:00 PM",
      set: "SET3",
      value: "150",
      result3d: "123",
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>3D Lottery</h1>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={() => navigate("/3d/rank")}>
            🏆
          </button>
          <button className={styles.iconBtn} onClick={() => navigate("/3d/closed-days")}>
            📅
          </button>
          <button className={styles.iconBtn} onClick={() => navigate("/3d/history")}>
            📊
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.lastResult}>
          <h2 className={styles.lastResultTitle}>Latest Result</h2>
          <p className={styles.lastResultValue}>---</p>
          <p className={styles.lastResultTime}>Updated: Just now</p>
        </div>

        <div className={styles.results}>
          {results.map((result, idx) => (
            <div key={idx} className={styles.resultCard}>
              <h3 className={styles.resultTime}>{result.time}</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <p className={styles.resultLabel}>SET</p>
                  <p className={styles.resultValue}>{result.set}</p>
                </div>
                <div className={styles.resultItem}>
                  <p className={styles.resultLabel}>VALUE</p>
                  <p className={styles.resultValue}>{result.value}</p>
                </div>
                <div className={styles.resultItem}>
                  <p className={styles.resultLabel}>3D</p>
                  <p className={`${styles.resultValue} ${styles.highlight}`}>
                    {result.result3d}
                  </p>
                </div>
              </div>
              <button
                className={styles.betBtn}
                onClick={() => navigate("/3d/bet")}
              >
                Place Bet
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
