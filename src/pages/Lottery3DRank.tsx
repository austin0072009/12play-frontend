import { useNavigate } from "react-router-dom";
import styles from "./Lottery3DRank.module.css";
import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

export default function Lottery3DRank() {
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState("today");

  const rankings = [
    { rank: 1, username: "Player_123", wins: 8, amount: 5000 },
    { rank: 2, username: "LuckyUser", wins: 6, amount: 4200 },
    { rank: 3, username: "WinStreak", wins: 5, amount: 3800 },
    { rank: 4, username: "BetMaster", wins: 4, amount: 2900 },
    { rank: 5, username: "HighRoller", wins: 3, amount: 2100 },
    { rank: 6, username: "GoldenHand", wins: 3, amount: 1950 },
    { rank: 7, username: "LotteryKing", wins: 2, amount: 1500 },
    { rank: 8, username: "FortuneFinder", wins: 2, amount: 1200 },
    { rank: 9, username: "WinnerWins", wins: 1, amount: 800 },
    { rank: 10, username: "TryAgain", wins: 1, amount: 500 },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>Leaderboard</h1>
      </header>

      <div className={styles.content}>
        {/* Time Frame Selection */}
        <div className={styles.timeFrameButtons}>
          {["today", "week", "month"].map((frame) => (
            <button
              key={frame}
              className={`${styles.timeFrameBtn} ${
                timeFrame === frame ? styles.active : ""
              }`}
              onClick={() => setTimeFrame(frame)}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>

        {/* Rankings Table */}
        <div className={styles.rankingsList}>
          {rankings.map((player, idx) => (
            <div key={idx} className={styles.rankCard}>
              <div className={styles.rankPosition}>
                {player.rank <= 3 ? (
                  <span className={styles.medal}>
                    {player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉"}
                  </span>
                ) : (
                  <span className={styles.rank}>{player.rank}</span>
                )}
              </div>

              <div className={styles.playerInfo}>
                <p className={styles.username}>{player.username}</p>
                <p className={styles.stats}>
                  {player.wins} win{player.wins > 1 ? "s" : ""}
                </p>
              </div>

              <div className={styles.winAmount}>
                <p className={styles.amount}>MMK {player.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <p>🏆 Top 10 Winners for {timeFrame}</p>
        </div>
      </div>
    </div>
  );
}
