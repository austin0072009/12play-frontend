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
import { getLotteryUserInfo, getBetSessions } from "../services/lottery";
import { showAlert } from "../store/alert";
import { useTranslation } from "react-i18next";

function formatTime(timeStr: string): string {
  if (!timeStr) return "N/A";
  const parts = timeStr.split(" ");
  if (parts.length < 2) return timeStr;
  return parts[1].split(".")[0];
}

export default function Lottery3DHome() {
  const { t } = useTranslation();
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

  const fetchUserInfo = async () => {
    if (!lotteryToken || !lotteryDomain) return;
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

  const fetchBetSessions = async () => {
    if (!lotteryToken || !lotteryDomain) return;
    try {
      const pending = await getBetSessions(2, 1);
      setPendingSessions(Array.isArray(pending) ? pending : []);
      const completed = await getBetSessions(2, 3);
      setCompletedSessions(completed);
    } catch (err) {
      console.error("Error fetching bet sessions:", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchBetSessions();
    const sessionInterval = setInterval(fetchBetSessions, 30000);
    return () => clearInterval(sessionInterval);
  }, [lotteryToken, lotteryDomain]);

  const nextDraw = (() => {
    if (!pendingSessions || pendingSessions.length === 0) return null;
    const now = Date.now();
    const upcoming = pendingSessions
      .filter((session) => {
        try {
          const sessionTime = new Date(session.win_time.replace(".0", "")).getTime();
          return sessionTime > now;
        } catch {
          return false;
        }
      })
      .sort((a, b) => new Date(a.win_time.replace(".0", "")).getTime() - new Date(b.win_time.replace(".0", "")).getTime());
    return upcoming.length > 0 ? upcoming[0] : null;
  })();

  const drawTime = nextDraw ? nextDraw.win_time.split(" ")[1]?.split(".")[0] : "N/A";

  useEffect(() => {
    const updateCountdown = () => {
      if (!nextDraw || !nextDraw.win_time) {
        setCountdown("00:00:00");
        return;
      }
      try {
        const drawDate = new Date(nextDraw.win_time.replace(".0", ""));
        const diff = drawDate.getTime() - Date.now();
        if (diff <= 0) {
          setCountdown("00:00:00");
          return;
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
      } catch {
        setCountdown("00:00:00");
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextDraw]);

  const latestResults = completedSessions.slice(0, 3);

  const handleBetClick = () => {
    if (nextDraw) {
      localStorage.setItem("selectedBetIssue", nextDraw.issue);
      navigate("/3d/bet");
    } else {
      showAlert(t("lottery3d.noSession"));
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>{t("lottery3d.title")}</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.quickActions}>
          <button className={styles.actionItem} onClick={() => navigate("/3d/rank")}>
            <TrophyIcon />
            <span>{t("lottery3d.rank")}</span>
          </button>
          <button className={styles.actionItem} onClick={() => navigate("/3d/history")}>
            <ClipboardDocumentListIcon />
            <span>{t("lottery3d.history")}</span>
          </button>
        </div>

        <div className={styles.roundCard}>
          <div>
            <p className={styles.roundLabel}>{t("lottery3d.nextDraw")}</p>
            <p className={styles.roundTime}>{drawTime}</p>
          </div>
          <div className={styles.roundStatus}>
            <ClockIcon className={styles.clockIcon} />
            <span>{countdown}</span>
            <span className={`${styles.badge} ${countdown === "00:00:00" ? styles.closed : styles.open}`}>
              {countdown === "00:00:00" ? t("common.closed") : t("common.open")}
            </span>
          </div>
        </div>

        <div className={styles.lastResult}>
          <p className={styles.lastResultTitle}>{t("lottery3d.latestResults")}</p>
          <p className={styles.lastResultValue}>{latestResults.length > 0 ? latestResults[0].win_num : "N/A"}</p>
          <p className={styles.lastResultTime}>
            {latestResults.length > 0 ? formatTime(latestResults[0].win_time) + " Draw" : ""}
          </p>
        </div>

        <div className={styles.yesterday}>
          <p className={styles.yesterdayTitle}>{t("lottery3d.latestResults")}</p>
          <div className={styles.yesterdayList}>
            {latestResults.map((result, idx) => (
              <div key={idx} className={styles.yesterdayItem}>
                <div className={styles.resultHeader}>
                  <span className={styles.yesterdayTime}>{result.win_time}</span>
                  <span className={styles.resultBadge}>#{idx + 1}</span>
                </div>
                <div className={styles.yesterdayNum}>{result.win_num}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        className={styles.betBtn}
        disabled={!lotteryToken || countdown === "00:00:00"}
        onClick={handleBetClick}
        title={t("common.bet")}
      >
        {!lotteryToken ? t("common.loading") : t("common.bet")}
      </button>
    </div>
  );
}
