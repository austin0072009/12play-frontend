import styles from "./GameCard.module.css";

export default function GameCard() {
  return (
    <div className={styles.gameCard}>
      <img
        className={styles.gameCardImage}
        src="../assets/images/image.bin"
        alt=""
      />
      <div className={styles.gameCardLabel}>
        <span>Starlight Princess</span>
      </div>
    </div>
  );
}
