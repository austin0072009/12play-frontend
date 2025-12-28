import { useNavigate } from "react-router-dom";
import styles from "./Lottery2DBetHistory.module.css";
import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

export default function Lottery2DBetHistory() {
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState("all");

  const bets = [
    {
      id: 1,
      date: "2025-12-28",
      time: "14:30",
      number: "45",
      set: "SET1",
      amount: 50,
      payout: "1x",
      status: "won",
      winAmount: 50,
    },
    {
      id: 2,
      date: "2025-12-28",
      time: "09:00",
      number: "78",
      set: "SET2",
      amount: 100,
      payout: "1.5x",
      status: "lost",
      winAmount: 0,
    },
    {
      id: 3,
      date: "2025-12-27",
      time: "16:45",
      number: "92",
      set: "SET3",
      amount: 200,
      payout: "2x",
      status: "pending",
      winAmount: 0,
    },
  ];

  const filteredBets = bets.filter((bet) => {
    if (filterTab === "won") return bet.status === "won";
    if (filterTab === "lost") return bet.status === "lost";
    if (filterTab === "pending") return bet.status === "pending";
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return styles.won;
      case "lost":
        return styles.lost;
      case "pending":
        return styles.pending;
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>Bet History</h1>
      </header>

      <div className={styles.content}>
        {/* Filter Tabs */}
        <div className={styles.tabs}>
          {["all", "won", "lost", "pending"].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${filterTab === tab ? styles.active : ""}`}
              onClick={() => setFilterTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Bets List */}
        <div className={styles.betsList}>
          {filteredBets.length > 0 ? (
            filteredBets.map((bet) => (
              <div key={bet.id} className={styles.betCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.dateTime}>
                    <p className={styles.date}>{bet.date}</p>
                    <p className={styles.time}>{bet.time}</p>
                  </div>
                  <span
                    className={`${styles.status} ${getStatusColor(
                      bet.status
                    )}`}
                  >
                    {bet.status.toUpperCase()}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.betInfo}>
                    <p className={styles.label}>Number</p>
                    <p className={styles.value}>{bet.number}</p>
                  </div>
                  <div className={styles.betInfo}>
                    <p className={styles.label}>Set</p>
                    <p className={styles.value}>{bet.set}</p>
                  </div>
                  <div className={styles.betInfo}>
                    <p className={styles.label}>Payout</p>
                    <p className={styles.value}>{bet.payout}</p>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div>
                    <p className={styles.label}>Bet Amount</p>
                    <p className={styles.value}>MYR {bet.amount}</p>
                  </div>
                  <div>
                    <p className={styles.label}>
                      {bet.status === "won" ? "Won" : "Potential Win"}
                    </p>
                    <p className={`${styles.value} ${styles.win}`}>
                      MYR {bet.winAmount}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noData}>
              <p>No bets found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
