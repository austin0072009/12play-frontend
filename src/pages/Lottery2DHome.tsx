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
import { showAlert } from "../store/alert";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [liveNum, setLiveNum] = useState<string>("N/A");
  const [liveSet, setLiveSet] = useState<string>("N/A");
  const [liveValue, setLiveValue] = useState<string>("N/A");
  const [showTimeSection, setShowTimeSection] = useState(false);
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const {
    lotteryToken,
    lotteryDomain,
    pendingSessions,
    completedSessions,
    closedDays,
    setUserInfo,
    setPendingSessions,
    setCompletedSessions,
    setClosedDays,
  } = useLotteryStore();

  // Fetch user info from lottery backend
  const fetchUserInfo = async () => {
    if (!lotteryToken || !lotteryDomain) {
      return;
    }

    try {
      const data = await getLotteryUserInfo();
      if (data) {
        setUserInfo({
          userName: data.userName || '',
          balance: parseFloat(data.balance) || 0,
          freeze: parseFloat(data.freeze) || 0,
          back_url: data.back_url || '',
        });
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      // Keep existing user info or set defaults
    }
  };

  // Fetch live 2D result
  const fetchLive2D = async () => {
    if (!lotteryToken || !lotteryDomain) {
      return;
    }

    try {
      const data = await get2DLiveResult();
      if (data && data.win_num !== undefined) {
        setLiveNum(data.win_num || "N/A");
        setLiveSet(data.set || "N/A");
        setLiveValue(data.value || "N/A");
      }
    } catch (err) {
      console.error("Error fetching 2D live result:", err);
      // Keep displaying the last known values or "N/A"
    }
  };

  // Fetch closed days for 2D game
  const fetchClosedDays = async () => {
    if (!lotteryToken || !lotteryDomain) {
      return;
    }

    try {
      const data = await getClosedDays(1); // 1 = 2D game
      setClosedDays(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching closed days:", err);
      setClosedDays([]); // Set empty array on error
    }
  };

  // Fetch pending and completed bet sessions
  const fetchBetSessions = async () => {
    if (!lotteryToken || !lotteryDomain) {
      return;
    }

    try {
      // Fetch pending sessions (winState=1)
      const pendingData = await getBetSessions(1, 1);
      setPendingSessions(Array.isArray(pendingData) ? pendingData : []);

      // Fetch completed/drawn sessions (winState=3)
      const completedData = await getBetSessions(1, 3);
      setCompletedSessions(Array.isArray(completedData) ? completedData : []);
    } catch (err) {
      console.error("Error fetching bet sessions:", err);
      // Set empty arrays on error to prevent undefined access
      setPendingSessions([]);
      setCompletedSessions([]);
    }
  };

  // Check if user has lottery credentials on mount
  useEffect(() => {
    if (!lotteryToken || !lotteryDomain) {
      console.warn("No lottery credentials found. User needs to access lottery through Home page.");
      showAlert(t("lottery2d.needAccess"), () => {
        navigate("/home");
      });
    }
  }, []);

  // Initialize and set up auto-refresh
  useEffect(() => {
    // Only proceed if we have lottery credentials
    if (!lotteryToken || !lotteryDomain) {
      console.warn("Lottery token or domain not available");
      return;
    }

    // Set the token for lottery requests
    setLotteryToken(lotteryToken);

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
      showAlert(t("lottery2d.closedAlert"));
      return;
    }

    // Guard: no active/pending sessions
    if (!pendingSessions || pendingSessions.length === 0 || !nextDraw) {
      showAlert(t("lottery2d.noSession"));
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
        <h1 className={styles.title}>{t("lottery2d.title")}</h1>
      </header>

      <div className={styles.content}>
        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button
            className={styles.actionItem}
            onClick={() => navigate("/2d/rank")}
          >
            <TrophyIcon />
            <span>{t("lottery2d.rank")}</span>
          </button>

          <button
            className={styles.actionItem}
            onClick={() => navigate("/2d/closed-days")}
          >
            <CalendarDaysIcon />
            <span>{t("lottery2d.closedDays")}</span>
          </button>

          <button
            className={styles.actionItem}
            onClick={() => navigate("/2d/history")}
          >
            <ClipboardDocumentListIcon />
            <span>{t("lottery2d.history")}</span>
          </button>
        </div>

        {/* Current Round */}
        <div className={styles.roundCard}>
          <div>
            <p className={styles.roundLabel}>{t("lottery2d.nextDraw")}</p>
            <p className={styles.roundTime}>{drawTime}</p>
          </div>

          <div className={styles.roundStatus}>
            <ClockIcon className={styles.clockIcon} />
            <span>{countdown}</span>
            <span className={`${styles.badge} ${countdown === "00:00:00" ? styles.closed : styles.open}`}>
              {countdown === "00:00:00" ? t("lottery2d.closedBadge") : t("lottery2d.openBadge")}
            </span>
          </div>
        </div>

        {/* LIVE 2D */}
        <div className={styles.lastResult}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot}></span>
            <span className={styles.liveText}>{t("lottery2d.liveTitle")}</span>
          </div>
          <p className={styles.lastResultValue}>{liveNum}</p>
          <div className={styles.liveMetadata}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>{t("lottery2d.set")}</span>
              <span className={styles.metadataValue}>{liveSet}</span>
            </div>
            <div className={styles.metadataDivider}></div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>{t("lottery2d.value")}</span>
              <span className={styles.metadataValue}>{liveValue}</span>
            </div>
          </div>
        </div>


        {/* Yesterday Results */}
        <div className={styles.yesterday}>
          <p className={styles.yesterdayTitle}>{t("lottery2d.latestResults")}</p>

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
                    <span className={styles.resultMetaLabel}>{t("lottery2d.set")}</span>
                    <span className={styles.resultMetaValue}>{result.set}</span>
                  </div>
                  <div className={styles.resultMetaItem}>
                    <span className={styles.resultMetaLabel}>{t("lottery2d.value")}</span>
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
        title={!lotteryToken ? "Please access lottery from Home page first" : "Place your bet"}
      >
        {!lotteryToken ? t("common.loading") : t("lottery2d.betButton")}
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
