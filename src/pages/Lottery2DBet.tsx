import { useNavigate } from "react-router-dom";
import styles from "./Lottery2DBet.module.css";
import { useMemo, useState, useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useLotteryStore } from "../store/lottery";
import { getSessionNumbers } from "../services/lottery";
import { showAlert } from "../store/alert";

type NumInfo = {
  num: string;
  remain: number;
  betPlaced: number;
  minBet: number;
  maxBet: number;
  odds: number;
};

const PAGE_SIZE = 25;

export default function Lottery2DBet() {
  const navigate = useNavigate();
  const { pendingSessions, userInfo } = useLotteryStore();
  
  // Get selected issue from localStorage
  const selectedIssue = localStorage.getItem("selectedBetIssue");
  
  // Find the selected session from pending sessions
  const selectedSession = useMemo(() => {
    if (!selectedIssue || !pendingSessions) return null;
    return pendingSessions.find(session => session.issue === selectedIssue);
  }, [selectedIssue, pendingSessions]);

  // Format session info
  const roundInfo = useMemo(() => {
    if (!selectedSession) {
      return {
        round: "N/A",
        drawTime: "N/A",
        balance: 0,
        issue: "N/A",
      };
    }
    
    const winTime = selectedSession.win_time.split(" ");
    const date = winTime[0] || "N/A";
    const time = winTime[1]?.split(".")[0] || "N/A";
    
    return {
      round: date,
      drawTime: time,
      balance: userInfo?.balance || 0,
      issue: selectedSession.issue,
    };
  }, [selectedSession, userInfo]);

  /* ===== Fetch session numbers (bet limits and remaining) ===== */
  const [allNumbers, setAllNumbers] = useState<NumInfo[]>([]);
  const [loadingNumbers, setLoadingNumbers] = useState(false);

  useEffect(() => {
    const fetchSessionNumbers = async () => {
      if (!selectedIssue) return;

      setLoadingNumbers(true);
      try {
        const data = await getSessionNumbers(selectedIssue, 1); // 1 = 2D game
        
        // Transform API data to NumInfo format
        const numbers: NumInfo[] = data.map((item) => ({
          num: item.num,
          remain: parseFloat(item.max_amount),
          betPlaced: item.bet_placed || 0,
          minBet: parseFloat(item.min_bet),
          maxBet: parseFloat(item.max_bet),
          odds: item.odds,
        }));
        
        setAllNumbers(numbers);
      } catch (err) {
        console.error("Error fetching session numbers:", err);
        // Fallback to mock data if API fails
        setAllNumbers(
          Array.from({ length: 100 }, (_, i) => ({
            num: i.toString().padStart(2, "0"),
            remain: Math.floor(Math.random() * 10000),
            betPlaced: Math.floor(Math.random() * 1000),
            minBet: 100,
            maxBet: 2600,
            odds: 85,
          }))
        );
      } finally {
        setLoadingNumbers(false);
      }
    };

    fetchSessionNumbers();
  }, [selectedIssue]);

  const [page, setPage] = useState(0);
  const [selectedNums, setSelectedNums] = useState<string[]>([]);
  const [betAmount, setBetAmount] = useState<number>(0);

  const pageCount = Math.ceil(allNumbers.length / PAGE_SIZE);
  const currentNumbers = allNumbers.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  const [selectedNumInfo, setSelectedNumInfo] = useState<NumInfo | null>(null);

  const toggleNumber = (numInfo: NumInfo) => {
    if (numInfo.remain <= 0) return;
    const isSelected = selectedNums.includes(numInfo.num);
    
    setSelectedNums((prev) =>
      isSelected
        ? prev.filter((n) => n !== numInfo.num)
        : [...prev, numInfo.num]
    );
    
    // Show info for newly selected number
    if (!isSelected) {
      setSelectedNumInfo(numInfo);
    }
  };

  const confirmBet = () => {
    if (selectedNums.length === 0 || betAmount <= 0) return;

    // Validate bet amount against max bet limits
    const overLimitNumbers: string[] = [];
    
    selectedNums.forEach((num) => {
      const numInfo = allNumbers.find((n) => n.num === num);
      if (numInfo && betAmount > numInfo.maxBet) {
        const overAmount = betAmount - numInfo.maxBet;
        overLimitNumbers.push(`${num}: over by MMK ${overAmount.toLocaleString()}`);
      }
    });

    if (overLimitNumbers.length > 0) {
      showAlert(
        `Bet amount exceeds maximum limit for the following numbers:\n\n${overLimitNumbers.join('\n')}\n\nPlease reduce your bet amount.`
      );
      return;
    }

    navigate("/2d/bet-confirm", {
      state: {
        round: roundInfo.round,
        drawTime: roundInfo.drawTime,
        numbers: selectedNums,
        amount: betAmount,
        issue: selectedIssue,
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
            <div className={styles.issue}>Issue: {roundInfo.issue}</div>
            <div className={styles.round}>{roundInfo.round}</div>
            <div className={styles.time}>Draw {roundInfo.drawTime}</div>
          </div>
          {/* <div className={styles.balance}>
            MMK {roundInfo.balance.toLocaleString()}
          </div> */}
        </div>

        {/* 已选号码 */}
        <div className={styles.selectedInfo}>
          Selected Numbers:{" "}
          <span className={styles.selectedCount}>
            {selectedNums.length}
          </span>
        </div>

        {/* Bet Limits Info */}
        {selectedNumInfo && (
          <div className={styles.betLimits}>
            <div className={styles.limitItem}>
              <span className={styles.limitLabel}>Min Bet:</span>
              <span className={styles.limitValue}>MMK {selectedNumInfo.minBet}</span>
            </div>
            <div className={styles.limitItem}>
              <span className={styles.limitLabel}>Max Bet:</span>
              <span className={styles.limitValue}>MMK {selectedNumInfo.maxBet}</span>
            </div>
            <div className={styles.limitItem}>
              <span className={styles.limitLabel}>Odds:</span>
              <span className={styles.limitValue}>1:{selectedNumInfo.odds}</span>
            </div>
          </div>
        )}

        {/* 金额输入 */}
        <input
          type="number"
          min={selectedNumInfo?.minBet || 0}
          max={selectedNumInfo?.maxBet || 0}
          placeholder={selectedNumInfo ? `Min: ${selectedNumInfo.minBet} - Max: ${selectedNumInfo.maxBet}` : "Enter Amount"}
          value={betAmount || ""}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className={styles.amountInput}
        />

        {loadingNumbers ? (
          <div className={styles.loading}>Loading numbers...</div>
        ) : (
          <>
            <div className={styles.numberGrid}>
              {currentNumbers.map((numInfo) => {
                const selected = selectedNums.includes(numInfo.num);
                const full = numInfo.remain <= 0;
                const betPercentage = Math.round((numInfo.betPlaced / numInfo.remain) * 100);
                const availablePercentage = 100 - betPercentage;

                return (
                  <button
                    key={numInfo.num}
                    className={`${styles.numBtn} ${
                      full ? styles.full : selected ? styles.selected : ""
                    }`}
                    onClick={() => toggleNumber(numInfo)}
                  >
                    <span className={styles.num}>{numInfo.num}</span>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${betPercentage}%` }}
                      />
                    </div>
                    <span className={styles.availability}>
                      {full ? "FULL" : `${availablePercentage}% Available`}
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
                        {/* BET Button */}
            <button
              className={styles.betBtn}
              onClick={confirmBet}
              disabled={selectedNums.length === 0 || betAmount <= 0}
            >
              BET NOW
            </button>
          </>
        )}
      </div>
    </div>
  );
}
