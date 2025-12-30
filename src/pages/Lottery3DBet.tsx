import { useNavigate } from "react-router-dom";
import styles from "./Lottery3DBet.module.css";
import { useMemo, useState, useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useLotteryStore } from "../store/lottery";
import { getSessionNumbers } from "../services/lottery";

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

  // Apply filters
  const filteredNumbers = useMemo(() => {
    let filtered = [...allNumbers];

    // Filter by range
    const rangeStart = selectedRange * RANGE_SIZE;
    const rangeEnd = (selectedRange + 1) * RANGE_SIZE;
    filtered = filtered.filter((n) => {
      const numVal = parseInt(n.num);
      return numVal >= rangeStart && numVal < rangeEnd;
    });

    // Filter by search
    if (searchNum.trim()) {
      filtered = filtered.filter((n) => n.num.includes(searchNum.trim()));
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
    if (selectedNums.length === 0 || betAmount <= 0) return;
    
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
        <div className={styles.loading}>Loading numbers...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ===== Header ===== */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>3D</h1>
      </header>

      {/* ===== Info Card ===== */}
      <div className={styles.infoCard}>
        {/* 场次 + 余额 */}
        <div className={styles.infoTop}>
          <div>
            <div className={styles.round}>{roundInfo.round}</div>
            <div className={styles.time}>Draw {roundInfo.drawTime}</div>
          </div>
          <div className={styles.balance}>
            MMK {roundInfo.balance.toLocaleString()}
          </div>
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
          placeholder={selectedNumInfo ? `Min: ${selectedNumInfo.minBet} - Max: ${selectedNumInfo.maxBet}` : "Enter Amount"}
          value={betAmount || ""}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className={styles.amountInput}
        />

        {/* BET 按钮 */}
        <button
          className={styles.betTopBtn}
          disabled={selectedNums.length === 0 || betAmount <= 0}
          onClick={confirmBet}
        >
          BET
        </button>
      </div>

      {/* ===== Filter Section ===== */}
      <div className={styles.filterSection}>
        {/* Range Selector */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Number Range:</label>
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
          <label className={styles.filterLabel}>Search:</label>
          <input
            type="text"
            placeholder="Find number (e.g., 123)"
            value={searchNum}
            onChange={(e) => {
              setSearchNum(e.target.value);
              setPage(0);
            }}
            className={styles.searchInput}
            maxLength={3}
          />
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
            <span>Available Only</span>
          </label>
        </div>

        {/* Results Count */}
        <div className={styles.resultsCount}>
          {filteredNumbers.length} numbers found
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
                  {full ? "FULL" : `${availablePercentage}%`}
                </span>
              </button>
            );
          })}
        </div>

        {filteredNumbers.length === 0 && (
          <div className={styles.noResults}>
            No numbers found matching your filter
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
      </div>
    </div>
  );
}
