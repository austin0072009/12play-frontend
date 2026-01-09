import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
  const [selectedNumInfo, setSelectedNumInfo] = useState<NumInfo | null>(null);
  const [showFastPick, setShowFastPick] = useState(false);

  // Fast pick number generators for 2D (00-99)
  const fastPickOptions = useMemo(() => {
    // Get available numbers (not full)
    const availableNums = allNumbers.filter(n => n.remain > 0).map(n => n.num);

    // Twin numbers: 00, 11, 22, ..., 99
    const twins = Array.from({ length: 10 }, (_, i) =>
      String(i).repeat(2)
    ).filter(n => availableNums.includes(n));

    // Small numbers: 00-49
    const small = availableNums.filter(n => parseInt(n) <= 49);

    // Big numbers: 50-99
    const big = availableNums.filter(n => parseInt(n) >= 50);

    // Odd numbers: 01, 03, 05, ..., 99
    const odd = availableNums.filter(n => parseInt(n) % 2 === 1);

    // Even numbers: 00, 02, 04, ..., 98
    const even = availableNums.filter(n => parseInt(n) % 2 === 0);

    // Lucky endings
    const endsWith8 = availableNums.filter(n => n.endsWith('8'));
    const endsWith7 = availableNums.filter(n => n.endsWith('7'));
    const endsWith6 = availableNums.filter(n => n.endsWith('6'));
    const endsWith9 = availableNums.filter(n => n.endsWith('9'));

    // Random pick function
    const getRandomPick = (count: number) => {
      const shuffled = [...availableNums].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    };

    return {
      twins,
      small,
      big,
      odd,
      even,
      endsWith8,
      endsWith7,
      endsWith6,
      endsWith9,
      getRandomPick,
      availableCount: availableNums.length,
    };
  }, [allNumbers]);

  // Handle fast pick selection
  const handleFastPick = (numbers: string[], append: boolean = true) => {
    if (append) {
      // Add to existing selection (avoid duplicates)
      setSelectedNums(prev => {
        const newSet = new Set([...prev, ...numbers]);
        return Array.from(newSet);
      });
    } else {
      // Replace selection
      setSelectedNums(numbers);
    }
    setShowFastPick(false);
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedNums([]);
    setShowFastPick(false);
  };

  const pageCount = Math.ceil(allNumbers.length / PAGE_SIZE);
  const currentNumbers = allNumbers.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

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
    if (selectedNums.length === 0) {
      showAlert(t("lottery2d.pleaseSelectNumbers"));
      return;
    }
    if (betAmount <= 0) {
      showAlert(t("lottery2d.pleaseEnterAmount"));
      return;
    }

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
        t("lottery2d.betExceedsLimit") + ":\n\n" + overLimitNumbers.join('\n') + "\n\n" + t("lottery2d.reduceAmount")
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
        <h1 className={styles.title}>{t("lottery2d.betTitle")}</h1>
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
          {t("lottery2d.selectedNumbers")}: <span className={styles.selectedCount}>
            {selectedNums.length}
          </span>
        </div>

        {/* Bet Limits Info */}
        {selectedNumInfo && (
          <div className={styles.betLimits}>
            <div className={styles.limitItem}>
              <span className={styles.limitLabel}>Min Bet:</span>
              <span className={styles.limitValue}>{t("lottery2d.minBet")}:</span>
              <span className={styles.limitValue}>MMK {selectedNumInfo.minBet}</span>
            </div>
            <div className={styles.limitItem}>
              <span className={styles.limitLabel}>{t("lottery2d.maxBet")}:</span>
              <span className={styles.limitValue}>MMK {selectedNumInfo.maxBet}</span>
            </div>
            <div className={styles.limitItem}>
              <span className={styles.limitLabel}>{t("lottery2d.odds")}:</span>
              <span className={styles.limitValue}>1:{selectedNumInfo.odds}</span>
            </div>
          </div>
        )}

        {/* 金额输入 */}
        <input
          type="number"
          min={selectedNumInfo?.minBet || 0}
          max={selectedNumInfo?.maxBet || 0}
          placeholder={selectedNumInfo ? `Min: ${selectedNumInfo.minBet} - Max: ${selectedNumInfo.maxBet}` : t("lottery2d.enterAmount")}
          value={betAmount || ""}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className={styles.amountInput}
        />

        {loadingNumbers ? (
          <div className={styles.loading}>{t("lottery2d.loadingNumbers")}</div>
        ) : (
          <>
            {/* Fast Pick Button */}
            <button
              className={styles.fastPickBtn}
              onClick={() => setShowFastPick(true)}
            >
              ⚡ Fast
            </button>

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
                      {full ? t("lottery2d.full") : `${availablePercentage}% ${t("lottery2d.available")}`}
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
              className={`${styles.betBtn} ${selectedNums.length === 0 || betAmount <= 0 ? styles.betBtnDisabled : ""}`}
              onClick={confirmBet}
            >
              {t("lottery2d.betNow")}
            </button>
          </>
        )}
      </div>

      {/* ===== Fast Pick Modal ===== */}
      {showFastPick && (
        <div className={styles.fastPickOverlay}>
          <div className={styles.fastPickModal}>
            <div className={styles.fastPickHeader}>
              <h2>⚡ Fast Pick</h2>
              <button
                className={styles.fastPickClose}
                onClick={() => setShowFastPick(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.fastPickContent}>
              {/* Pattern Section */}
              <div className={styles.fastPickSection}>
                <h3>📊 Patterns</h3>
                <div className={styles.fastPickGrid}>
                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.twins)}
                    disabled={fastPickOptions.twins.length === 0}
                  >
                    <span className={styles.fastPickIcon}>👯</span>
                    <span className={styles.fastPickLabel}>Twins</span>
                    <span className={styles.fastPickDesc}>00, 11, 22...</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.twins.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.small)}
                    disabled={fastPickOptions.small.length === 0}
                  >
                    <span className={styles.fastPickIcon}>🔽</span>
                    <span className={styles.fastPickLabel}>Small</span>
                    <span className={styles.fastPickDesc}>00-49</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.small.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.big)}
                    disabled={fastPickOptions.big.length === 0}
                  >
                    <span className={styles.fastPickIcon}>🔼</span>
                    <span className={styles.fastPickLabel}>Big</span>
                    <span className={styles.fastPickDesc}>50-99</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.big.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.odd)}
                    disabled={fastPickOptions.odd.length === 0}
                  >
                    <span className={styles.fastPickIcon}>1️⃣</span>
                    <span className={styles.fastPickLabel}>Odd</span>
                    <span className={styles.fastPickDesc}>01, 03, 05...</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.odd.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.even)}
                    disabled={fastPickOptions.even.length === 0}
                  >
                    <span className={styles.fastPickIcon}>2️⃣</span>
                    <span className={styles.fastPickLabel}>Even</span>
                    <span className={styles.fastPickDesc}>00, 02, 04...</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.even.length}</span>
                  </button>
                </div>
              </div>

              {/* Lucky Endings Section */}
              <div className={styles.fastPickSection}>
                <h3>🍀 Lucky Endings</h3>
                <div className={styles.fastPickGrid}>
                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.endsWith8)}
                    disabled={fastPickOptions.endsWith8.length === 0}
                  >
                    <span className={styles.fastPickIcon}>8️⃣</span>
                    <span className={styles.fastPickLabel}>Ends 8</span>
                    <span className={styles.fastPickDesc}>08, 18, 28...</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.endsWith8.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.endsWith9)}
                    disabled={fastPickOptions.endsWith9.length === 0}
                  >
                    <span className={styles.fastPickIcon}>9️⃣</span>
                    <span className={styles.fastPickLabel}>Ends 9</span>
                    <span className={styles.fastPickDesc}>09, 19, 29...</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.endsWith9.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.endsWith7)}
                    disabled={fastPickOptions.endsWith7.length === 0}
                  >
                    <span className={styles.fastPickIcon}>7️⃣</span>
                    <span className={styles.fastPickLabel}>Ends 7</span>
                    <span className={styles.fastPickDesc}>07, 17, 27...</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.endsWith7.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.endsWith6)}
                    disabled={fastPickOptions.endsWith6.length === 0}
                  >
                    <span className={styles.fastPickIcon}>6️⃣</span>
                    <span className={styles.fastPickLabel}>Ends 6</span>
                    <span className={styles.fastPickDesc}>06, 16, 26...</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.endsWith6.length}</span>
                  </button>
                </div>
              </div>

              {/* Random Section */}
              <div className={styles.fastPickSection}>
                <h3>🎲 Random Pick</h3>
                <div className={styles.fastPickGrid}>
                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.getRandomPick(5))}
                    disabled={fastPickOptions.availableCount < 5}
                  >
                    <span className={styles.fastPickIcon}>🎯</span>
                    <span className={styles.fastPickLabel}>Random 5</span>
                    <span className={styles.fastPickDesc}>5 lucky numbers</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.getRandomPick(10))}
                    disabled={fastPickOptions.availableCount < 10}
                  >
                    <span className={styles.fastPickIcon}>🎯</span>
                    <span className={styles.fastPickLabel}>Random 10</span>
                    <span className={styles.fastPickDesc}>10 lucky numbers</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.getRandomPick(20))}
                    disabled={fastPickOptions.availableCount < 20}
                  >
                    <span className={styles.fastPickIcon}>🎯</span>
                    <span className={styles.fastPickLabel}>Random 20</span>
                    <span className={styles.fastPickDesc}>20 lucky numbers</span>
                  </button>
                </div>
              </div>

              {/* Selection Info & Clear */}
              <div className={styles.fastPickFooter}>
                <span className={styles.fastPickSelected}>
                  Selected: {selectedNums.length} numbers
                </span>
                <button
                  className={styles.fastPickClear}
                  onClick={clearAllSelections}
                  disabled={selectedNums.length === 0}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
