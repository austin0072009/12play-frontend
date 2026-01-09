import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Lottery2DBetHistory.module.css";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { getBetRecords } from "../services/lottery";

type BetDetail = {
  id: number;
  num: string;
  amount: number;
  winAmount: number;
  status: "won" | "lost" | "pending";
};

type BetOrder = {
  round: string;
  date: string;
  time: string;
  details: BetDetail[];
  totalAmount: number;
  totalWinAmount: number;
  netAmount: number;
};

export default function Lottery2DBetHistory() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        const records = await getBetRecords(1, "", 1, 10); // 1 = 2D game, empty issue means all
        //console.log("Fetched bet records:", records);

        // Group records by issue
        const groupedMap = new Map<string, BetOrder>();
        
        records.forEach((r) => {
          const issue = r.issue;
          const amount = parseFloat(r.bet_amount || "0") || 0;
          const winAmount = parseFloat(r.award || "0") || 0;
          const created = r.created_at || "";
          const [date, time] = created.split(" ");

          // Determine status based on is_lottery and award amount
          // is_lottery: 1 = pending, 2 = drawn/completed
          let betStatus: "won" | "lost" | "pending";
          if (r.is_lottery === 1) {
            betStatus = "pending";
          } else if (r.is_lottery === 2) {
            // Lottery drawn - check if won based on award amount
            betStatus = winAmount > 0 ? "won" : "lost";
          } else {
            betStatus = "pending"; // fallback
          }

          const detail: BetDetail = {
            id: r.id,
            num: r.bet_number,
            amount,
            winAmount,
            status: betStatus,
          };

          if (groupedMap.has(issue)) {
            const existing = groupedMap.get(issue)!;
            existing.details.push(detail);
            existing.totalAmount += amount;
            existing.totalWinAmount += winAmount;
            existing.netAmount = existing.totalWinAmount - existing.totalAmount;
          } else {
            const totalAmount = amount;
            const totalWinAmount = winAmount;
            groupedMap.set(issue, {
              round: issue,
              date: date || "",
              time: time || "",
              details: [detail],
              totalAmount,
              totalWinAmount,
              netAmount: totalWinAmount - totalAmount,
            });
          }
        });

        setOrders(Array.from(groupedMap.values()));
      } catch (err: any) {
        setError(err?.message || t("lottery2d.failedLoadHistory"));
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filterTab === "won") return o.netAmount > 0;
      if (filterTab === "lost") return o.netAmount < 0;
      if (filterTab === "pending") return o.netAmount === 0 || o.details.some((d) => d.status === "pending");
      return true;
    });
  }, [orders, filterTab]);

  const toggleExpand = (issue: string) => {
    setExpandedIssues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(issue)) {
        newSet.delete(issue);
      } else {
        newSet.add(issue);
      }
      return newSet;
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>{t("lottery2d.betHistory")}</h1>
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
              {t(`lottery2d.filter_${tab}`)}
            </button>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && <div className={styles.noData}>{t("common.loading")}</div>}
        {error && <div className={styles.noData}>{error}</div>}

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
                    <span className={`${styles.status} ${
                      order.netAmount > 0 ? styles.won : order.netAmount < 0 ? styles.lost : styles.pending
                    }`}>
                      {order.netAmount > 0 ? t("lottery2d.statusWon") : order.netAmount < 0 ? t("lottery2d.statusLost") : t("lottery2d.statusPending")}
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
                    <div className={styles.label}>{t("lottery2d.totalBet")}</div>
                    <div className={styles.value}>
                      MMK {order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className={styles.label}>{t("lottery2d.totalWin")}</div>
                    <div
                      className={`${styles.value} ${
                        order.netAmount > 0 ? styles.win : order.netAmount < 0 ? styles.loss : ""
                      }`}
                    >
                      {order.netAmount > 0 ? "+" : ""}MMK {order.netAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={styles.detailsSection}>
                    <div className={styles.detailsHeader}>{t("lottery2d.betDetails")}</div>
                    {order.details.map((detail, idx) => (
                      <div key={`${detail.id}-detail-${idx}`} className={styles.detailRow}>
                        <div className={styles.detailNumber}>
                          {detail.num}
                          <span className={`${styles.status} ${styles[detail.status]}`}>
                            {detail.status === "won" ? t("lottery2d.statusWon") : detail.status === "lost" ? t("lottery2d.statusLost") : t("lottery2d.statusPending")}
                          </span>
                        </div>
                        <div className={styles.detailAmounts}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t("lottery2d.bet")}:</span>
                            <span className={styles.detailValue}>MMK {detail.amount.toFixed(2)}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t("lottery2d.win")}:</span>
                            <span className={`${styles.detailValue} ${
                              detail.winAmount > 0 ? styles.win : ""
                            }`}>MMK {detail.winAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {!loading && !error && filtered.length === 0 && (
            <div className={styles.noData}>{t("lottery2d.noBetsFound")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
