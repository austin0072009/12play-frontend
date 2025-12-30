import { useNavigate } from "react-router-dom";
import styles from "./Lottery2DRank.module.css";
import { useEffect, useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { getBetSessions, getWinRanking } from "../services/lottery";
import { useLotteryStore } from "../store/lottery";

interface RankingItem {
  userId: number;
  username: string;
  winAmount: number;
}

interface SessionRanking {
  sessionTime: string;
  issue: string;
  rankings: RankingItem[];
}

export default function Lottery2DRank() {
  const navigate = useNavigate();
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

        // Find latest 12:00 and 16:30 sessions
        const session12 = completedSessions.find(s => s.win_time.includes("12:00"));
        const session1630 = completedSessions.find(s => s.win_time.includes("16:30"));

        const rankingsData: SessionRanking[] = [];

        // Fetch rankings for 12:00 session
        if (session12) {
          try {
            const ranking12 = await getWinRanking(1, session12.issue);
            rankingsData.push({
              sessionTime: "12:00",
              issue: session12.issue,
              rankings: ranking12.ranking || [],
            });
          } catch (err) {
            console.error("Error fetching 12:00 ranking:", err);
          }
        }

        // Fetch rankings for 16:30 session
        if (session1630) {
          try {
            const ranking1630 = await getWinRanking(1, session1630.issue);
            rankingsData.push({
              sessionTime: "16:30",
              issue: session1630.issue,
              rankings: ranking1630.ranking || [],
            });
          } catch (err) {
            console.error("Error fetching 16:30 ranking:", err);
          }
        }

        setSessionRankings(rankingsData);
      } catch (err: any) {
        setError(err?.message || "Failed to load rankings");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [lotteryToken]);

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
        <h1 className={styles.title}>Leaderboard</h1>
      </header>

      <div className={styles.content}>
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && sessionRankings.length === 0 && (
          <div className={styles.noData}>No rankings available</div>
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
                      <div key={player.userId} className={styles.rankCard}>
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
                          <p className={styles.username}>{player.username}</p>
                        </div>

                        <div className={styles.winAmount}>
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
