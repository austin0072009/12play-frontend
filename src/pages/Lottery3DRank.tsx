import { useNavigate } from "react-router-dom";
import styles from "./Lottery3DRank.module.css";
import { useEffect, useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { getBetSessions, getWinRanking } from "../services/lottery";
import { useLotteryStore } from "../store/lottery";

interface RankingItem {
  userId: number;
  username: string;
  winAmount: number;
}

export default function Lottery3DRank() {
  const navigate = useNavigate();
  const { lotteryToken } = useLotteryStore();
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionIssue, setSessionIssue] = useState<string>("");

  useEffect(() => {
    const fetchRankings = async () => {
      if (!lotteryToken) {
        setError("Please login to view rankings");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch completed sessions (winState=3 for drawn/completed) for 3D (gameId=2)
        const completedSessions = await getBetSessions(2, 3);

        // Find latest completed session
        const latestSession = completedSessions.length > 0 ? completedSessions[0] : null;

        if (latestSession) {
          setSessionIssue(latestSession.issue);
          
          try {
            const rankingData = await getWinRanking(2, latestSession.issue);
            setRankings(rankingData.ranking || []);
          } catch (err) {
            console.error("Error fetching ranking:", err);
            setError("Failed to load rankings");
          }
        } else {
          setError("No completed sessions available");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load rankings");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [lotteryToken]);

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

        {!loading && !error && (
          <>
            {sessionIssue && (
              <div className={styles.sessionHeader}>
                <span className={styles.sessionIssue}>Issue: {sessionIssue}</span>
              </div>
            )}

            {rankings.length > 0 ? (
              <div className={styles.rankingsList}>
                {rankings.map((player, idx) => (
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
          </>
        )}
      </div>
    </div>
  );
}
