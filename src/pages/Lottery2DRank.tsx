import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Lottery2DRank.module.css";
import { useEffect, useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { getBetSessions, getWinRanking } from "../services/lottery";
import { useLotteryStore } from "../store/lottery";

import type { LotteryRankRespItem } from "../services/types";

const getDisplayName = (player: LotteryRankRespItem) => {
  const isAllStars = (value?: string | null) => !value || value.replace(/\*/g, "").length === 0;

  if (isAllStars(player.phone) && !isAllStars(player.nickname)) return player.nickname;
  if (isAllStars(player.nickname) && !isAllStars(player.phone)) return player.phone;

  // Prefer nickname when both are available/not masked
  return player.nickname || player.phone || "-";
};

interface SessionRanking {
  sessionTime: string;
  issue: string;
  rankings: LotteryRankRespItem[];
}

export default function Lottery2DRank() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lotteryToken } = useLotteryStore();
  const [sessionRankings, setSessionRankings] = useState<SessionRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("12:00");

  useEffect(() => {
    const fetchRankings = async () => {
      if (!lotteryToken) {
        setError("Please login to view rankings");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch completed sessions (winState=3 for drawn/completed)
        const completedSessions = await getBetSessions(1, 3);

        const rankingsData: SessionRanking[] = [];

        // Process up to 2 latest completed sessions
        const sessionsToProcess = completedSessions.slice(0, 2);

        for (const session of sessionsToProcess) {
          try {
            const rankings = await getWinRanking(1, session.issue);
            // Extract time from win_time (format may vary, e.g., "2026-01-14 16:30:00" or similar)
            const timeMatch = session.win_time.match(/(\d{1,2}:\d{2})/);
            const sessionTime = timeMatch ? timeMatch[1] : session.issue;

            rankingsData.push({
              sessionTime,
              issue: session.issue,
              rankings: rankings || [],
            });
          } catch (err) {
            console.error(`Error fetching ranking for session ${session.issue}:`, err);
          }
        }

        setSessionRankings(rankingsData);
        // Set active tab to first session if available
        if (rankingsData.length > 0) {
          setActiveTab(rankingsData[0].sessionTime);
        }
      } catch (err: any) {
        setError(err?.message || t("lottery2d.failedLoadRankings"));
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [lotteryToken, t]);

  // Get the currently active session ranking
  const activeSessionRanking = sessionRankings.find(
    (sr) => sr.sessionTime === activeTab
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>ထီပေါက်သူ</h1>
      </header>

      <div className={styles.content}>
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && sessionRankings.length === 0 && (
          <div className={styles.noData}>Issue: </div>
        )}

        {!loading && !error && sessionRankings.length > 0 && (
          <>
            {/* Session Tabs */}
            <div className={styles.timeFrameButtons}>
              {sessionRankings.map((sessionRanking) => (
                <button
                  key={sessionRanking.sessionTime}
                  className={`${styles.timeFrameBtn} ${
                    activeTab === sessionRanking.sessionTime ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab(sessionRanking.sessionTime)}
                >
                  {sessionRanking.sessionTime} Session
                </button>
              ))}
            </div>

            {/* Active Session Rankings */}
            {activeSessionRanking && (
              <div className={styles.sessionSection}>
                <div className={styles.sessionHeader}>
                  <span className={styles.sessionIssue}>Issue: {activeSessionRanking.issue}</span>
                </div>

                {activeSessionRanking.rankings.length > 0 ? (
                  <div className={styles.rankingsList}>
                    {activeSessionRanking.rankings.map((player, idx) => (
                      <div key={player.user_id} className={styles.rankCard}>
                        <div className={styles.rankPosition}>
                          {idx + 1 <= 3 ? (
                            <span className={styles.medal}>
                              {idx + 1 === 1 ? "🥇" : idx + 1 === 2 ? "🥈" : "🥉"}
                            </span>
                          ) : (
                            <span className={styles.rank}>{idx + 1}</span>
                          )}
                        </div>

                        <div className={styles.playerInfo}>
                          <p className={styles.username}>{getDisplayName(player)}</p>
                        </div>

                        <div className={styles.winAmount}>
                          <p className={styles.label}>Bet</p>
                          <p className={styles.amount}>MMK {player.betAmount.toLocaleString()}</p>
                          <p className={styles.label}>Win</p>
                          <p className={styles.amount}>MMK {player.winAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noRankings}>No winners for this session</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
