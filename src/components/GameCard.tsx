import styles from "./GameCard.module.css";

export default function GameCard({ game, onClick }: { game: any; onClick?: () => void }) {
  return (
    <div className={styles.gameCard} onClick={onClick}>
      <img
        className={styles.gameCardImage}
        src={game.img || game.m_img}
        alt={game.game_name}
      />
      <div className={styles.gameCardLabel}>
        <span>{game.game_name || game.title || game.name}</span>
      </div>
    </div>
  );
}
