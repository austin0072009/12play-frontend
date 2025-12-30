import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Lottery2DHome.module.css";
import {
  ChevronLeftIcon,
  TrophyIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { useLotteryStore } from "../store/lottery";
import { setLotteryToken } from "../utils/lotteryRequest";
import {
  getLotteryUserInfo,
  getBetSessions,
  get2DLiveResult,
  getClosedDays,
} from "../services/lottery";
import Lottery2DTimeSectionPopup from "../components/Lottery2DTimeSectionPopup";

interface BetSessionData {
  issue: string;
  win_time: string;
  set: string;
  value: string;
  win_num: string;
  winState?: number;
}

/**
 * Format time from "YYYY-MM-DD HH:MM:SS.mmm" to "HH:MM"
 */
function formatTime(timeStr: string): string {
  if (!timeStr) return "N/A";
  const parts = timeStr.split(" ");
  if (parts.length < 2) return timeStr;
  return parts[1].split(".")[0]; // Get HH:MM:SS and remove milliseconds
}

export default function Lottery2DHome() {
  const navigate = useNavigate();
  const [liveNum, setLiveNum] = useState<string>("N/A");
  const [liveSet, setLiveSet] = useState<string>("N/A");
  const [liveValue, setLiveValue] = useState<string>("N/A");
  const [showTimeSection, setShowTimeSection] = useState(false);
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const {
    lotteryToken,
    lotteryDomain,
    userInfo,
    pendingSessions,
    completedSessions,
    closedDays,
    setUserInfo,
    setPendingSessions,
    setCompletedSessions,
    setClosedDays,
    setError,
  } = useLotteryStore();

  // Fetch user info from lottery backend
  const fetchUserInfo = async () => {
    if (!lotteryToken || !lotteryDomain) {
      return;
    }

    try {
      setLotteryToken(lotteryToken);
      const data = await getLotteryUserInfo();
      setUserInfo({
        userName: data.userName,
        balance: parseFloat(data.balance),
        freeze: parseFloat(data.freeze),
        back_url: data.back_url,
      });
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  // Fetch live 2D result
  const fetchLive2D = async () => {
    if (!lotteryToken || !lotteryDomain) {
      return;
    }

    try {
      const data = await get2DLiveResult();
      setLiveNum(data.win_num);
      setLiveSet(data.set);
      setLiveValue(data.value);
    } catch (err) {
      console.error("Error fetching 2D live result:", err);
    }
  };

  // Fetch closed days for 2D game
  const fetchClosedDays = async () => {
    if (!lotteryToken || !lotteryDomain) {
      return;
    }

    try {
      const data = await getClosedDays(1); // 1 = 2D game
      setClosedDays(data as any);
    } catch (err) {
      console.error("Error fetching closed days:", err);
    }
  };

  // Fetch pending and completed bet sessions
  const fetchBetSessions = async () => {
    if (!lotteryToken || !lotteryDomain) {
      return;
    }

    try {
      // Fetch pending sessions (winState=1)
      const pendingSessions = await getBetSessions(1, 1);
      setPendingSessions(Array.isArray(pendingSessions) ? pendingSessions : []);

      // Fetch completed/drawn sessions (winState=3)
      const completedSessions = await getBetSessions(1, 3);
      


      setCompletedSessions(completedSessions);
    } catch (err) {
      console.error("Error fetching bet sessions:", err);
    }
  };

  // Initialize and set up auto-refresh
  useEffect(() => {
    // Initial fetch
    fetchUserInfo();
    fetchBetSessions();
    fetchClosedDays();
    fetchLive2D();

    // Set up auto-refresh for bet sessions every 30 seconds
    const sessionInterval = setInterval(() => {
      fetchBetSessions();
    }, 30000);

    // Set up auto-refresh for live 2D every 3 seconds
    const live2dInterval = setInterval(() => {
      fetchLive2D();
    }, 3000);

    return () => {
      if (sessionInterval) {
        clearInterval(sessionInterval);
      }
      if (live2dInterval) {
        clearInterval(live2dInterval);
      }
    };
  }, [lotteryToken, lotteryDomain]);

  // Find the next draw (nearest upcoming session)
  const nextDraw = (() => {
    if (!pendingSessions || pendingSessions.length === 0) return null;
    
    const now = new Date().getTime();
    
    // Filter sessions that are in the future and sort by time
    const upcomingSessions = pendingSessions
      .filter(session => {
        try {
          const sessionTime = new Date(session.win_time.replace(".0", "")).getTime();
          return sessionTime > now;
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        const timeA = new Date(a.win_time.replace(".0", "")).getTime();
        const timeB = new Date(b.win_time.replace(".0", "")).getTime();
        return timeA - timeB;
      });
    
    return upcomingSessions.length > 0 ? upcomingSessions[0] : null;
  })();

  const drawTime = nextDraw ? nextDraw.win_time.split(" ")[1]?.split(".")[0] : "N/A";

  // Countdown timer effect
  useEffect(() => {
    const updateCountdown = () => {
      if (!nextDraw || !nextDraw.win_time) {
        setCountdown("00:00:00");
        return;
      }

      try {
        const drawDate = new Date(nextDraw.win_time.replace(".0", ""));
        const now = new Date();
        const diff = drawDate.getTime() - now.getTime();

        if (diff <= 0) {
          setCountdown("00:00:00");
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );
      } catch (err) {
        setCountdown("00:00:00");
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [nextDraw]);


  // Get latest 2 completed results
  const getYesterdayResults = () => {
    return completedSessions.slice(0, 2);
  };

  const yesterdayResults = getYesterdayResults();

  // Check if today is a closed day
  const isClosedDay = () => {
    if (!Array.isArray(closedDays) || closedDays.length === 0) {
      return false;
    }
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`; // YYYY-MM-DD local format
    const todayDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Convert Sunday (0) to 7 for API format (1=Monday, 7=Sunday)
    const todayDayNum = todayDayOfWeek === 0 ? 7 : todayDayOfWeek;
    
    return closedDays.some((closedDay: any) => {
      // Type 1: Recurring day of week
      if (closedDay.type === 1 && closedDay.day) {
        return closedDay.day === todayDayNum;
      }
      // Type 2: Specific date
      if (closedDay.type === 2 && closedDay.date) {
        return closedDay.date === todayDate;
      }
      return false;
    });
  };

  // Handle BET button click with closed day check
  const handleBetClick = () => {
    if (isClosedDay()) {
      alert("Betting is closed today. Please try again tomorrow.");
      return;
    }
    // Show time section selection modal instead of navigating directly
    setShowTimeSection(true);
  };

  // Handle section selection from modal
  const handleSelectSection = (issue: string) => {
    // Store the selected issue in localStorage or pass via state
    localStorage.setItem("selectedBetIssue", issue);
    navigate("/2d/bet");
  };

  return (
    <div className={styles.container}>
      {/* Header：只保留导航 */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>2D Lottery</h1>
      </header>

      <div className={styles.content}>
        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button
            className={styles.actionItem}
            onClick={() => navigate("/2d/rank")}
          >
            <TrophyIcon />
            <span>Rank</span>
          </button>

          <button
            className={styles.actionItem}
            onClick={() => navigate("/2d/closed-days")}
          >
            <CalendarDaysIcon />
            <span>Closed</span>
          </button>

          <button
            className={styles.actionItem}
            onClick={() => navigate("/2d/history")}
          >
            <ClipboardDocumentListIcon />
            <span>History</span>
          </button>
        </div>

        {/* Current Round */}
        <div className={styles.roundCard}>
          <div>
            <p className={styles.roundLabel}>Next Draw</p>
            <p className={styles.roundTime}>{drawTime}</p>
          </div>

          <div className={styles.roundStatus}>
            <ClockIcon className={styles.clockIcon} />
            <span>{countdown}</span>
            <span className={`${styles.badge} ${countdown === "00:00:00" ? styles.closed : styles.open}`}>
              {countdown === "00:00:00" ? "CLOSED" : "OPEN"}
            </span>
          </div>
        </div>

        {/* LIVE 2D */}
        <div className={styles.lastResult}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot}></span>
            <span className={styles.liveText}>LIVE</span>
          </div>
          <p className={styles.lastResultValue}>{liveNum}</p>
          <div className={styles.liveMetadata}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>SET</span>
              <span className={styles.metadataValue}>{liveSet}</span>
            </div>
            <div className={styles.metadataDivider}></div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>VALUE</span>
              <span className={styles.metadataValue}>{liveValue}</span>
            </div>
          </div>
        </div>


        {/* Yesterday Results */}
        <div className={styles.yesterday}>
          <p className={styles.yesterdayTitle}>Latest Results</p>

          <div className={styles.yesterdayList}>
            {yesterdayResults.map((result, idx) => (
              <div key={idx} className={styles.yesterdayItem}>
                <div className={styles.resultHeader}>
                  <span className={styles.yesterdayTime}>
                    {formatTime(result.win_time)}
                  </span>
                  <span className={styles.resultBadge}>#{idx + 1}</span>
                </div>
                <div className={styles.yesterdayNum}>{result.win_num}</div>
                <div className={styles.resultMetadata}>
                  <div className={styles.resultMetaItem}>
                    <span className={styles.resultMetaLabel}>SET</span>
                    <span className={styles.resultMetaValue}>{result.set}</span>
                  </div>
                  <div className={styles.resultMetaItem}>
                    <span className={styles.resultMetaLabel}>VAL</span>
                    <span className={styles.resultMetaValue}>{result.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating BET */}
      <button
        className={styles.betBtn}
        disabled={!lotteryToken}
        onClick={handleBetClick}
      >
        BET
      </button>

      {/* Time Section Selection Modal */}
      {showTimeSection && (
        <Lottery2DTimeSectionPopup
          sessions={pendingSessions}
          onClose={() => setShowTimeSection(false)}
          onSelectSection={handleSelectSection}
        />
      )}
    </div>
  );
}
