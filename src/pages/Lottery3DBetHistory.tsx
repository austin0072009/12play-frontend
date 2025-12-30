import { useNavigate } from "react-router-dom";
import styles from "./Lottery3DBetHistory.module.css";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { getBetRecords } from "../services/lottery";

type BetDetail = {
  id: number;
  num: string;
  amount: number;
  winAmount: number;
};

type BetOrder = {
  round: string;
  date: string;
  time: string;
  status: "won" | "lost" | "pending";
  details: BetDetail[];
  totalAmount: number;
  totalWinAmount: number;
};

export default function Lottery3DBetHistory() {
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState("all");
  const [orders, setOrders] = useState<BetOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const records = await getBetRecords(2, "", 1, 10); // 2 = 3D game

        // Group records by issue
        const groupedMap = new Map<string, BetOrder>();
        
        records.forEach((r) => {
          const issue = r.issue;
          const amount = parseFloat(r.bet_amount || "0") || 0;
          const winAmount = parseFloat(r.award || "0") || 0;
          const created = r.created_at || "";
          const [date, time] = created.split(" ");
          
          const detail: BetDetail = {
            id: r.id,
            num: r.bet_number,
            amount,
            winAmount,
          };

          if (groupedMap.has(issue)) {
            const existing = groupedMap.get(issue)!;
            existing.details.push(detail);
            existing.totalAmount += amount;
            existing.totalWinAmount += winAmount;
            // Update status: if any bet won, mark as won; if all lost, mark as lost
            if (r.is_win === 1) {
              existing.status = "won";
            } else if (r.is_win === 0 && existing.status === "pending") {
              existing.status = "lost";
            }
          } else {
            const status: BetOrder["status"] = r.is_win === 1 ? "won" : r.is_win === 0 ? "lost" : "pending";
            groupedMap.set(issue, {
              round: issue,
              date: date || "",
              time: time || "",
              status,
              details: [detail],
              totalAmount: amount,
              totalWinAmount: winAmount,
            });
          }
        });

        setOrders(Array.from(groupedMap.values()));
      } catch (err) {
        console.error("Failed to fetch 3D bet records:", err);
        setError("Failed to load bet history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleExpand = (issue: string) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(issue)) {
        next.delete(issue);
      } else {
        next.add(issue);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filterTab === "won") return o.status === "won";
      if (filterTab === "lost") return o.status === "lost";
      if (filterTab === "pending") return o.status === "pending";
      return true;
    });
  }, [orders, filterTab]);

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronLeftIcon className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>Bet History</h1>
        </header>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronLeftIcon className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>Bet History</h1>
        </header>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

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
          {!loading && !error && filtered.map((order) => {
            const isExpanded = expandedIssues.has(order.round);
            
            return (
              <div
                key={order.round}
                className={styles.card}
                onClick={() => toggleExpand(order.round)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.round}>{order.round}</div>
                    <div className={styles.date}>
                      {order.date} {order.time}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`${styles.status} ${styles[order.status]}`}>
                      {order.status.toUpperCase()}
                    </span>
                    {isExpanded ? (
                      <ChevronUpIcon className={styles.expandIcon} />
                    ) : (
                      <ChevronDownIcon className={styles.expandIcon} />
                    )}
                  </div>
                </div>

                {/* Numbers - Show all numbers in collapsed view */}
                <div className={styles.numbers}>
                  {order.details.map((detail, idx) => (
                    <span key={`${detail.id}-${idx}`} className={styles.numTag}>
                      {detail.num}
                    </span>
                  ))}
                </div>

                {/* Summary Footer */}
                <div className={styles.footer}>
                  <div>
                    <div className={styles.label}>Total Bet</div>
                    <div className={styles.value}>
                      MMK {order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className={styles.label}>Total Win</div>
                    <div
                      className={`${styles.value} ${
                        order.status === "won" ? styles.win : ""
                      }`}
                    >
                      MMK {order.totalWinAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={styles.detailsSection}>
                    <div className={styles.detailsTitle}>Bet Details</div>
                    {order.details.map((detail, idx) => (
                      <div key={`${detail.id}-detail-${idx}`} className={styles.detailRow}>
                        <div className={styles.detailNumber}>{detail.num}</div>
                        <div className={styles.detailAmounts}>
                          <span>Bet: MMK {detail.amount.toFixed(2)}</span>
                          <span className={
                            detail.winAmount > 0 ? styles.win : ""
                          }>Win: MMK {detail.winAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {!loading && !error && filtered.length === 0 && (
            <div className={styles.noData}>No bets found</div>
          )}
        </div>
      </div>
    </div>
  );
}
