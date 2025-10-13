import { useEffect, useState, type SetStateAction } from "react";
import styles from "./Promotions.module.css";
import DepositPage from "../components/DepositPage";
import WithdrawalPage from "../components/WithdrawalPage";
import WalletHistoryPage from "../components/WalletHistoryPage";
export default function Promotions() {
  const [activeTab, setActiveTab] = useState("All"); // withdrawal , history

  const [tabs, setTabs] = useState([
    "All",
    "New Member",
    "VIP",
    "Special",
    "Casino",
    "Slot",
    "Sports",
    "Winner",
  ]);

  const handleChangeTab = (page: SetStateAction<string>) => {
    setActiveTab(page);
  };
  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        {tabs.map((tab, i) => (
          <div
            className={`${styles.tabItem}  ${
              activeTab === tab && styles.active
            }`}
            onClick={() => handleChangeTab(tab)}
          >
            <span>{tab}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "2rem", marginTop: "1rem", marginBottom: "20rem" }}>
        <div className={styles.promotionDiv}>
          <div className={styles.promoImage}>
            <img src="https://dummyimage.com/1080x278/fff/000" alt="" />
          </div>
          <div className={styles.cardBody}>
            <p className={styles.title}>12REWARD MINIGAME</p>
            <p className={styles.subtitle}>Join & Win MYR888!</p>
            <p className={styles.date}>18 Days 8 hours 50 minutes 54 seconds</p>
            <button className={styles.detailBtn}>More Info</button>
          </div>
        </div>
        <div className={styles.promotionDiv}>
          <div className={styles.promoImage}>
            <img src="https://dummyimage.com/1080x278/fff/000" alt="" />
          </div>
          <div className={styles.cardBody}>
            <p className={styles.title}>12REWARD MINIGAME</p>
            <p className={styles.subtitle}>Join & Win MYR888!</p>
            <p className={styles.date}>18 Days 8 hours 50 minutes 54 seconds</p>
            <button className={styles.detailBtn}>More Info</button>
          </div>
        </div>
        <div className={styles.promotionDiv}>
          <div className={styles.promoImage}>
            <img src="https://dummyimage.com/1080x278/fff/000" alt="" />
          </div>
          <div className={styles.cardBody}>
            <p className={styles.title}>12REWARD MINIGAME</p>
            <p className={styles.subtitle}>Join & Win MYR888!</p>
            <p className={styles.date}>18 Days 8 hours 50 minutes 54 seconds</p>
            <button className={styles.detailBtn}>More Info</button>
          </div>
        </div>
        <div className={styles.promotionDiv}>
          <div className={styles.promoImage}>
            <img src="https://dummyimage.com/1080x278/fff/000" alt="" />
          </div>
          <div className={styles.cardBody}>
            <p className={styles.title}>12REWARD MINIGAME</p>
            <p className={styles.subtitle}>Join & Win MYR888!</p>
            <p className={styles.date}>18 Days 8 hours 50 minutes 54 seconds</p>
            <button className={styles.detailBtn}>More Info</button>
          </div>
        </div>
        <div className={styles.promotionDiv}>
          <div className={styles.promoImage}>
            <img src="https://dummyimage.com/1080x278/fff/000" alt="" />
          </div>
          <div className={styles.cardBody}>
            <p className={styles.title}>12REWARD MINIGAME</p>
            <p className={styles.subtitle}>Join & Win MYR888!</p>
            <p className={styles.date}>18 Days 8 hours 50 minutes 54 seconds</p>
            <button className={styles.detailBtn}>More Info</button>
          </div>
        </div>
      </div>
    </div>
  );
}
