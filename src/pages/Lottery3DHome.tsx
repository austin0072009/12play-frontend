import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Lottery3DHome.module.css";
import {
  ChevronLeftIcon,
  TrophyIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { useLotteryStore } from "../store/lottery";
import { setLotteryToken } from "../utils/lotteryRequest";
import {
  getLotteryUserInfo,
  getBetSessions,
} from "../services/lottery";

/**
 * Format time from "YYYY-MM-DD HH:MM:SS.mmm" to "HH:MM"
 */
function formatTime(timeStr: string): string {
  if (!timeStr) return "N/A";
  const parts = timeStr.split(" ");
  if (parts.length < 2) return timeStr;
  return parts[1].split(".")[0]; // Get HH:MM:SS and remove milliseconds
}

export default function Lottery3DHome() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const {
    lotteryToken,
    lotteryDomain,
    pendingSessions,
    completedSessions,
    setUserInfo,
    setPendingSessions,
    setCompletedSessions,
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

  // Fetch pending and completed bet sessions
  const fetchBetSessions = async () => {
    if (!lotteryToken || !lotteryDomain) {
      return;
    }

    try {
      // Fetch pending sessions (winState=1) for 3D (gameId=2)
      const pendingSessions = await getBetSessions(2, 1);
      setPendingSessions(Array.isArray(pendingSessions) ? pendingSessions : []);

      // Fetch completed/drawn sessions (winState=3)
      const completedSessions = await getBetSessions(2, 3);
      setCompletedSessions(completedSessions);
    } catch (err) {
      console.error("Error fetching bet sessions:", err);
    }
  };

  // Initialize and set up auto-refresh
  useEffect(() => {
    fetchUserInfo();
    fetchBetSessions();

    // Set up auto-refresh for bet sessions every 30 seconds
    const sessionInterval = setInterval(() => {
      fetchBetSessions();
    }, 30000);

    return () => {
      if (sessionInterval) {
        clearInterval(sessionInterval);
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

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [nextDraw]);

  // Get latest 3 completed results
  const getLatestResults = () => {
    return completedSessions.slice(0, 3);
  };

  const latestResults = getLatestResults();

  // Handle BET button click - navigate directly to bet with latest pending session
  const handleBetClick = () => {
    if (nextDraw) {
      localStorage.setItem("selectedBetIssue", nextDraw.issue);
      navigate("/3d/bet");
    } else {
      alert("No active betting session available.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Header：只保留导航 */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>3D Lottery</h1>
      </header>

      <div className={styles.content}>
        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button
            className={styles.actionItem}
            onClick={() => navigate("/3d/rank")}
          >
            <TrophyIcon />
            <span>Rank</span>
          </button>

          <button
            className={styles.actionItem}
            onClick={() => navigate("/3d/history")}
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

        {/* Latest Result */}
        <div className={styles.lastResult}>
          <p className={styles.lastResultTitle}>Latest Result</p>
          <p className={styles.lastResultValue}>
            {latestResults.length > 0 ? latestResults[0].win_num : "N/A"}
          </p>
          <p className={styles.lastResultTime}>
            {latestResults.length > 0 ? formatTime(latestResults[0].win_time) + " Draw" : ""}
          </p>
        </div>

        {/* Result List - Yesterday Style */}
        <div className={styles.yesterday}>
          <p className={styles.yesterdayTitle}>Latest Results</p>

          <div className={styles.yesterdayList}>
            {latestResults.map((result, idx) => (
              <div key={idx} className={styles.yesterdayItem}>
                <div className={styles.resultHeader}>
                  <span className={styles.yesterdayTime}>
                    {result.win_time}
                  </span>
                  <span className={styles.resultBadge}>#{idx + 1}</span>
                </div>
                <div className={styles.yesterdayNum}>{result.win_num}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bet Button - Floating Action Button */}
      <button
        className={styles.betBtn}
        disabled={!lotteryToken || countdown === "00:00:00"}
        onClick={handleBetClick}
        title="Place Bet"
      >
        BET
      </button>
    </div>
  );
}
