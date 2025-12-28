import { useNavigate } from "react-router-dom";
import styles from "./Lottery2DBet.module.css";
import { useMemo, useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

type NumInfo = {
  num: string;
  remain: number;
};

const PAGE_SIZE = 20;

export default function Lottery2DBet() {
  const navigate = useNavigate();

  /* ===== mock：场次 & 用户 ===== */
  const roundInfo = {
    round: "2025-01-28",
    drawTime: "16:30",
    balance: 12500,
  };

  /* ===== mock：号码剩余额度 ===== */
  const allNumbers: NumInfo[] = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        num: i.toString().padStart(2, "0"),
        remain: Math.floor(Math.random() * 1000),
      })),
    []
  );

  const [page, setPage] = useState(0);
  const [selectedNums, setSelectedNums] = useState<string[]>([]);
  const [betAmount, setBetAmount] = useState<number>(0);

  const pageCount = Math.ceil(allNumbers.length / PAGE_SIZE);
  const currentNumbers = allNumbers.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  const toggleNumber = (num: string, remain: number) => {
    if (remain <= 0) return;
    setSelectedNums((prev) =>
      prev.includes(num)
        ? prev.filter((n) => n !== num)
        : [...prev, num]
    );
  };

  const confirmBet = () => {
    if (selectedNums.length === 0 || betAmount <= 0) return;
    navigate("/2d/bet-confirm", {
      state: {
        round: roundInfo.round,
        drawTime: roundInfo.drawTime,
        numbers: selectedNums,
        amount: betAmount,
      },
    });
  };

  return (
    <div className={styles.container}>
      {/* ===== Header ===== */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>2D</h1>
      </header>

      {/* ===== Info Card（核心信息区） ===== */}
      <div className={styles.infoCard}>
        {/* 场次 + 余额 */}
        <div className={styles.infoTop}>
          <div>
            <div className={styles.round}>{roundInfo.round}</div>
            <div className={styles.time}>Draw {roundInfo.drawTime}</div>
          </div>
          <div className={styles.balance}>
            MYR {roundInfo.balance.toLocaleString()}
          </div>
        </div>

        {/* 已选号码 */}
        <div className={styles.selectedInfo}>
          Selected Numbers:{" "}
          <span className={styles.selectedCount}>
            {selectedNums.length}
          </span>
        </div>

        {/* 金额输入 */}
        <input
          type="number"
          min={0}
          placeholder="Enter Amount"
          value={betAmount || ""}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className={styles.amountInput}
        />

        {/* 快速金额 */}
        <div className={styles.quickAmounts}>
          {[100, 300, 500, 1000].map((amt) => (
            <button
              key={amt}
              className={`${styles.amountBtn} ${
                betAmount === amt ? styles.active : ""
              }`}
              onClick={() => setBetAmount(amt)}
            >
              {amt}
            </button>
          ))}
        </div>

        {/* BET 按钮 */}
        <button
          className={styles.betTopBtn}
          disabled={selectedNums.length === 0 || betAmount <= 0}
          onClick={confirmBet}
        >
          BET
        </button>
      </div>

      {/* ===== Number Selection ===== */}
      <div className={styles.content}>
        <div className={styles.numberGrid}>
          {currentNumbers.map(({ num, remain }) => {
            const selected = selectedNums.includes(num);
            const full = remain <= 0;

            return (
              <button
                key={num}
                className={`${styles.numBtn} ${
                  full ? styles.full : selected ? styles.selected : ""
                }`}
                onClick={() => toggleNumber(num, remain)}
              >
                <span className={styles.num}>{num}</span>
                <span className={styles.remain}>
                  {full ? "FULL" : remain}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ‹
          </button>
          <span>
            {page + 1} / {pageCount}
          </span>
          <button
            disabled={page === pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
