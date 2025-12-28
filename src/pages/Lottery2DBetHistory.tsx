import { useNavigate } from "react-router-dom";
import styles from "./Lottery2DBetHistory.module.css";
import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

type BetOrder = {
  id: number;
  date: string;
  time: string;
  round: string;
  status: "won" | "lost" | "pending";
  numbers: { num: string; amount: number }[];
  totalAmount: number;
  winAmount: number;
};

export default function Lottery2DBetHistory() {
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState("all");

  /* mock：真实结构的下注历史 */
  const orders: BetOrder[] = [
    {
      id: 1,
      date: "2025-12-28",
      time: "14:30",
      round: "2025-01-28 14:30",
      status: "won",
      numbers: [
        { num: "12", amount: 50 },
        { num: "45", amount: 50 },
      ],
      totalAmount: 100,
      winAmount: 150,
    },
    {
      id: 2,
      date: "2025-12-28",
      time: "09:00",
      round: "2025-01-28 09:00",
      status: "lost",
      numbers: [
        { num: "78", amount: 100 },
        { num: "92", amount: 100 },
      ],
      totalAmount: 200,
      winAmount: 0,
    },
    {
      id: 3,
      date: "2025-12-27",
      time: "16:45",
      round: "2025-01-27 16:45",
      status: "pending",
      numbers: [{ num: "33", amount: 300 }],
      totalAmount: 300,
      winAmount: 0,
    },
  ];

  const filtered = orders.filter((o) => {
    if (filterTab === "won") return o.status === "won";
    if (filterTab === "lost") return o.status === "lost";
    if (filterTab === "pending") return o.status === "pending";
    return true;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>Bet History</h1>
      </header>

      <div className={styles.content}>
        {/* Tabs */}
        <div className={styles.tabs}>
          {["all", "won", "lost", "pending"].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${
                filterTab === tab ? styles.active : ""
              }`}
              onClick={() => setFilterTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className={styles.list}>
          {filtered.map((order) => (
            <div key={order.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.round}>{order.round}</div>
                  <div className={styles.date}>
                    {order.date} {order.time}
                  </div>
                </div>
                <span className={`${styles.status} ${styles[order.status]}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              {/* Numbers */}
              <div className={styles.numbers}>
                {order.numbers.map((n) => (
                  <span key={n.num} className={styles.numTag}>
                    {n.num}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className={styles.footer}>
                <div>
                  <div className={styles.label}>Bet</div>
                  <div className={styles.value}>
                    MYR {order.totalAmount}
                  </div>
                </div>
                <div>
                  <div className={styles.label}>Win</div>
                  <div
                    className={`${styles.value} ${
                      order.status === "won" ? styles.win : ""
                    }`}
                  >
                    MYR {order.winAmount}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className={styles.noData}>No bets found</div>
          )}
        </div>
      </div>
    </div>
  );
}
