import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Lottery3DBet.module.css";
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

const PAGE_SIZE = 20;
const RANGE_SIZE = 100; // 100 numbers per range (000-099, 100-199, etc.)

export default function Lottery3DBet() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { pendingSessions, userInfo } = useLotteryStore();
  
  // Get selected issue from localStorage
  const selectedIssue = localStorage.getItem("selectedBetIssue");
  
  // Find the selected session from pending sessions (3D)
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
        const data = await getSessionNumbers(selectedIssue, 2); // 2 = 3D game
        
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
        console.error("Error fetching 3D session numbers:", err);
        // Fallback to mock data if API fails
        setAllNumbers(
          Array.from({ length: 1000 }, (_, i) => ({
            num: i.toString().padStart(3, "0"),
            remain: Math.floor(Math.random() * 1000),
            betPlaced: Math.floor(Math.random() * 500),
            minBet: 100,
            maxBet: 2600,
            odds: 500,
          }))
        );
      } finally {
        setLoadingNumbers(false);
      }
    };

    fetchSessionNumbers();
  }, [selectedIssue]);

  // Filter and search state
  const [searchNum, setSearchNum] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<number>(0);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Generate range options (000-099, 100-199, etc.)
  const rangeOptions = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const start = i * RANGE_SIZE;
      const end = (i + 1) * RANGE_SIZE - 1;
      return {
        value: i,
        label: `${start.toString().padStart(3, "0")}-${end.toString().padStart(3, "0")}`,
      };
    });
  }, []);

  // Auto-update range when search finds a match
  useEffect(() => {
    if (searchNum.trim().length === 3) {
      // Full 3-digit search - auto jump to that range
      const numVal = parseInt(searchNum.trim());
      if (!isNaN(numVal) && numVal >= 0 && numVal <= 999) {
        const targetRange = Math.floor(numVal / RANGE_SIZE);
        if (targetRange !== selectedRange) {
          setSelectedRange(targetRange);
          setPage(0);
        }
      }
    }
  }, [searchNum]);

  // Apply filters
  const filteredNumbers = useMemo(() => {
    let filtered = [...allNumbers];

    // If searching, search across ALL numbers first
    if (searchNum.trim()) {
      filtered = filtered.filter((n) => n.num.includes(searchNum.trim()));
    } else {
      // No search - filter by selected range only
      const rangeStart = selectedRange * RANGE_SIZE;
      const rangeEnd = (selectedRange + 1) * RANGE_SIZE;
      filtered = filtered.filter((n) => {
        const numVal = parseInt(n.num);
        return numVal >= rangeStart && numVal < rangeEnd;
      });
    }

    // Filter by availability
    if (showOnlyAvailable) {
      filtered = filtered.filter((n) => n.remain > 0);
    }

    return filtered;
  }, [allNumbers, selectedRange, searchNum, showOnlyAvailable]);

  const [page, setPage] = useState(0);
  const [selectedNums, setSelectedNums] = useState<string[]>([]);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [selectedNumInfo, setSelectedNumInfo] = useState<NumInfo | null>(null);
  const [showFastPick, setShowFastPick] = useState(false);

  // Fast pick number generators
  const fastPickOptions = useMemo(() => {
    // Get available numbers (not full)
    const availableNums = allNumbers.filter(n => n.remain > 0).map(n => n.num);

    // Triple numbers: 000, 111, 222, ..., 999
    const triples = Array.from({ length: 10 }, (_, i) =>
      String(i).repeat(3)
    ).filter(n => availableNums.includes(n));

    // Double numbers: numbers with at least 2 same digits (like 001, 011, 100, 110, etc.)
    const doubles = availableNums.filter(num => {
      const digits = num.split('');
      return digits[0] === digits[1] || digits[1] === digits[2] || digits[0] === digits[2];
    });

    // Sequence up: 012, 123, 234, 345, 456, 567, 678, 789
    const seqUp = ['012', '123', '234', '345', '456', '567', '678', '789']
      .filter(n => availableNums.includes(n));

    // Sequence down: 987, 876, 765, 654, 543, 432, 321, 210
    const seqDown = ['987', '876', '765', '654', '543', '432', '321', '210']
      .filter(n => availableNums.includes(n));

    // Lucky endings (8, 7, 6)
    const endsWith8 = availableNums.filter(n => n.endsWith('8'));
    const endsWith7 = availableNums.filter(n => n.endsWith('7'));
    const endsWith6 = availableNums.filter(n => n.endsWith('6'));

    // Random pick function
    const getRandomPick = (count: number) => {
      const shuffled = [...availableNums].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    };

    return {
      triples,
      doubles,
      seqUp,
      seqDown,
      endsWith8,
      endsWith7,
      endsWith6,
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

  const pageCount = Math.ceil(filteredNumbers.length / PAGE_SIZE);
  const currentNumbers = filteredNumbers.slice(
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

    // Find number details for selected numbers
    const numberDetails = selectedNums.map(num => {
      const numInfo = allNumbers.find(n => n.num === num);
      return {
        num,
        minBet: numInfo?.minBet || 100,
        maxBet: numInfo?.maxBet || 2600,
        odds: numInfo?.odds || 500,
      };
    });

    navigate("/3d/bet-confirm", {
      state: {
        round: roundInfo.round,
        drawTime: roundInfo.drawTime,
        issue: roundInfo.issue,
        numbers: selectedNums,
        numberDetails,
        amount: betAmount,
      },
    });
  };

  // Redirect if no session selected
  useEffect(() => {
    if (!selectedIssue) {
      navigate("/3d");
    }
  }, [selectedIssue, navigate]);

  if (loadingNumbers) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronLeftIcon className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>3D</h1>
        </header>
        <div className={styles.loading}>{t("lottery3d.loading")}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>{t("lottery3d.title")}</h1>
      </header>

      {/* ===== Info Card ===== */}
      <div className={styles.infoCard}>
        {/* 场次 + 余额 */}
        <div className={styles.infoTop}>
          <div>
            <div className={styles.round}>{roundInfo.round}</div>
            <div className={styles.time}>{t("lottery3d.draw")} {roundInfo.drawTime}</div>
          </div>
          <div className={styles.balance}>
            MMK {roundInfo.balance.toLocaleString()}
          </div>
        </div>

        {/* 已选号码 */}
        <div className={styles.selectedInfo}>
          {t("lottery3d.selectedNumbers")}{" "}
          <span className={styles.selectedCount}>
            {selectedNums.length}
          </span>
        </div>

        {/* Bet Limits Info */}
        {selectedNumInfo && (
          <div className={styles.betLimits}>
            <div className={styles.limitItem}>
              <span className={styles.limitLabel}>{t("lottery3d.minBet")}</span>
              <span className={styles.limitValue}>MMK {selectedNumInfo.minBet}</span>
            </div>
            <div className={styles.limitItem}>
              <span className={styles.limitLabel}>{t("lottery3d.maxBet")}</span>
              <span className={styles.limitValue}>MMK {selectedNumInfo.maxBet}</span>
            </div>
            <div className={styles.limitItem}>
              <span className={styles.limitLabel}>{t("lottery3d.odds")}</span>
              <span className={styles.limitValue}>1:{selectedNumInfo.odds}</span>
            </div>
          </div>
        )}

        {/* 金额输入 */}
        <input
          type="number"
          min={selectedNumInfo?.minBet || 0}
          placeholder={ t("lottery2d.enterAmount")}
          value={betAmount || ""}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className={styles.amountInput}
        />
      </div>

      {/* ===== Filter Section ===== */}
      <div className={styles.filterSection}>
        {/* Range Selector */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>{t("lottery3d.numberRange")}</label>
          <select 
            value={selectedRange}
            onChange={(e) => {
              setSelectedRange(Number(e.target.value));
              setPage(0);
            }}
            className={styles.rangeSelect}
          >
            {rangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>{t("lottery3d.search")}:</label>
          <input
            type="text"
            placeholder={t("lottery3d.searchPlaceholder")}
            value={searchNum}
            onChange={(e) => {
              // Only allow digits
              const value = e.target.value.replace(/\D/g, "");
              setSearchNum(value);
              setPage(0);
            }}
            className={styles.searchInput}
            maxLength={3}
          />
          {searchNum && (
            <button
              className={styles.clearSearch}
              onClick={() => {
                setSearchNum("");
                setPage(0);
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Availability Toggle */}
        <div className={styles.filterGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={(e) => {
                setShowOnlyAvailable(e.target.checked);
                setPage(0);
              }}
              className={styles.checkbox}
            />
            <span>{t("lottery3d.availableOnly")}</span>
          </label>
        </div>

        {/* Fast Pick Button */}
        <button
          className={styles.fastPickBtn}
          onClick={() => setShowFastPick(true)}
        >
          {t("lottery3d.fast")}
        </button>

        {/* Results Count */}
        <div className={styles.resultsCount}>
          {filteredNumbers.length} {t("lottery3d.numbersFound")}
        </div>
      </div>

      {/* ===== Number Selection ===== */}
      <div className={styles.content}>
        <div className={styles.numberGrid}>
          {currentNumbers.map((numInfo) => {
            const selected = selectedNums.includes(numInfo.num);
            const full = numInfo.remain <= 0;
            const betPercentage = numInfo.remain > 0 ? Math.round((numInfo.betPlaced / (numInfo.betPlaced + numInfo.remain)) * 100) : 100;
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
                  {full ? t("lottery3d.full") : `${availablePercentage}%`}
                </span>
              </button>
            );
          })}
        </div>

        {filteredNumbers.length === 0 && (
          <div className={styles.noResults}>
            {t("lottery3d.noResults")}
          </div>
        )}

        {/* Pagination */}
        {filteredNumbers.length > 0 && (
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
        )}

        {/* BET Button */}
        <button
          className={`${styles.betBtn} ${selectedNums.length === 0 || betAmount <= 0 ? styles.betBtnDisabled : ""}`}
          onClick={confirmBet}
        >
          {t("lottery2d.betNow")}
        </button>
      </div>

      {/* ===== Fast Pick Modal ===== */}
      {showFastPick && (
        <div className={styles.fastPickOverlay}>
          <div className={styles.fastPickModal}>
            <div className={styles.fastPickHeader}>
              <h2>{t("lottery3d.fastPick")}</h2>
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
                <h3>{t("lottery3d.patterns")}</h3>
                <div className={styles.fastPickGrid}>
                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.triples)}
                    disabled={fastPickOptions.triples.length === 0}
                  >
                    <span className={styles.fastPickIcon}>🎰</span>
                    <span className={styles.fastPickLabel}>{t("lottery3d.triple")}</span>
                    <span className={styles.fastPickDesc}>{t("lottery3d.tripleDesc")}</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.triples.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.doubles)}
                    disabled={fastPickOptions.doubles.length === 0}
                  >
                    <span className={styles.fastPickIcon}>👯</span>
                    <span className={styles.fastPickLabel}>{t("lottery3d.double")}</span>
                    <span className={styles.fastPickDesc}>{t("lottery3d.doubleDesc")}</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.doubles.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.seqUp)}
                    disabled={fastPickOptions.seqUp.length === 0}
                  >
                    <span className={styles.fastPickIcon}>📈</span>
                    <span className={styles.fastPickLabel}>{t("lottery3d.seqUp")}</span>
                    <span className={styles.fastPickDesc}>{t("lottery3d.seqUpDesc")}</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.seqUp.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.seqDown)}
                    disabled={fastPickOptions.seqDown.length === 0}
                  >
                    <span className={styles.fastPickIcon}>📉</span>
                    <span className={styles.fastPickLabel}>{t("lottery3d.seqDown")}</span>
                    <span className={styles.fastPickDesc}>{t("lottery3d.seqDownDesc")}</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.seqDown.length}</span>
                  </button>
                </div>
              </div>

              {/* Lucky Endings Section */}
              <div className={styles.fastPickSection}>
                <h3>{t("lottery3d.luckyEndings")}</h3>
                <div className={styles.fastPickGrid}>
                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.endsWith8)}
                    disabled={fastPickOptions.endsWith8.length === 0}
                  >
                    <span className={styles.fastPickIcon}>8️⃣</span>
                    <span className={styles.fastPickLabel}>{t("lottery3d.ends8")}</span>
                    <span className={styles.fastPickDesc}>{t("lottery3d.ends8Desc")}</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.endsWith8.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.endsWith7)}
                    disabled={fastPickOptions.endsWith7.length === 0}
                  >
                    <span className={styles.fastPickIcon}>7️⃣</span>
                    <span className={styles.fastPickLabel}>{t("lottery3d.ends7")}</span>
                    <span className={styles.fastPickDesc}>{t("lottery3d.ends7Desc")}</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.endsWith7.length}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.endsWith6)}
                    disabled={fastPickOptions.endsWith6.length === 0}
                  >
                    <span className={styles.fastPickIcon}>6️⃣</span>
                    <span className={styles.fastPickLabel}>{t("lottery3d.ends6")}</span>
                    <span className={styles.fastPickDesc}>{t("lottery3d.ends6Desc")}</span>
                    <span className={styles.fastPickCount}>{fastPickOptions.endsWith6.length}</span>
                  </button>
                </div>
              </div>

              {/* Random Section */}
              <div className={styles.fastPickSection}>
                <h3>{t("lottery3d.randomPick")}</h3>
                <div className={styles.fastPickGrid}>
                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.getRandomPick(5))}
                    disabled={fastPickOptions.availableCount < 5}
                  >
                    <span className={styles.fastPickIcon}>🎯</span>
                    <span className={styles.fastPickLabel}>{t("lottery3d.random5")}</span>
                    <span className={styles.fastPickDesc}>{t("lottery3d.random5Desc")}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.getRandomPick(10))}
                    disabled={fastPickOptions.availableCount < 10}
                  >
                    <span className={styles.fastPickIcon}>🎯</span>
                    <span className={styles.fastPickLabel}>{t("lottery3d.random10")}</span>
                    <span className={styles.fastPickDesc}>{t("lottery3d.random10Desc")}</span>
                  </button>

                  <button
                    className={styles.fastPickOption}
                    onClick={() => handleFastPick(fastPickOptions.getRandomPick(20))}
                    disabled={fastPickOptions.availableCount < 20}
                  >
                    <span className={styles.fastPickIcon}>🎯</span>
                    <span className={styles.fastPickLabel}>{t("lottery3d.random20")}</span>
                    <span className={styles.fastPickDesc}>{t("lottery3d.random20Desc")}</span>
                  </button>
                </div>
              </div>

              {/* Selection Info & Clear */}
              <div className={styles.fastPickFooter}>
                <span className={styles.fastPickSelected}>
                  {t("lottery3d.selected")} {selectedNums.length}
                </span>
                <button
                  className={styles.fastPickClear}
                  onClick={clearAllSelections}
                  disabled={selectedNums.length === 0}
                >
                  {t("lottery3d.clearAll")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
