import { useState, type SetStateAction } from "react";
import styles from "./Wallet.module.css";
import DepositPage from "../components/DepositPage";
import WithdrawalPage from "../components/WithdrawalPage";
import WalletHistoryPage from "../components/WalletHistoryPage";
export default function Wallet() {
  const [activeTab, setActiveTab] = useState("deposit"); // withdrawal , history

  const handleChangeTab = (page: SetStateAction<string>) => {
    setActiveTab(page);
  };
  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        <div
          className={`${styles.tabItem}  ${
            activeTab === "deposit" && styles.active
          }`}
          onClick={() => handleChangeTab("deposit")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24px"
            className={styles.tabItemIcon}
            height="24px"
          >
            <g clip-path="url(#Deposit_svg__a)">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 8.176 12 11.5m0 0L9 8.176m3 3.324V3"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
                d="M6 8H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.5M18 8h1a2 2 0 0 1 2 2v3"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
                d="M14.782 13c.14.337.218.705.218 1.09 0 1.608-1.343 2.91-3 2.91s-3-1.302-3-2.91c0-.385.077-.753.218-1.09"
              ></path>
              <circle
                cx="18"
                cy="14"
                r="1"
                fill="currentColor"
                transform="rotate(180 18 14)"
              ></circle>
              <circle
                cx="6"
                cy="14"
                r="1"
                fill="currentColor"
                transform="rotate(180 6 14)"
              ></circle>
            </g>
            <defs>
              <clipPath id="Deposit_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <span>Deposit</span>
        </div>
        <div
          className={`${styles.tabItem} ${
            activeTab === "withdrawal" && styles.active
          }`}
          onClick={() => handleChangeTab("withdrawal")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
            className={styles.tabItemIcon}
          >
            <g clip-path="url(#Withdraw_svg__a)">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
                d="M9.218 11A2.8 2.8 0 0 1 9 9.91C9 8.301 10.343 7 12 7s3 1.302 3 2.91c0 .385-.077.753-.218 1.09"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7.5 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3m-4 8h2a2 2 0 0 0 2-2v-1"
              ></path>
              <circle cx="6" cy="10" r="1" fill="currentColor"></circle>
              <circle cx="18" cy="10" r="1" fill="currentColor"></circle>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m9 19 3 2.5m0 0 3-2.5m-3 2.5v-9"
              ></path>
            </g>
            <defs>
              <clipPath id="Withdraw_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <span>Withdrawal</span>
        </div>
        <div
          className={`${styles.tabItem} ${
            activeTab === "history" && styles.active
          }`}
          onClick={() => handleChangeTab("history")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
            className={styles.tabItemIcon}
          >
            <g
              stroke="currentColor"
              stroke-width="2"
              clip-path="url(#History_svg__a)"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 7v6h5"
              ></path>
              <circle cx="12" cy="12" r="9"></circle>
            </g>
            <defs>
              <clipPath id="History_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <span>History</span>
        </div>
      </div>
      {activeTab === "deposit" && <DepositPage />}
      {activeTab === "withdrawal" && <WithdrawalPage />}
      {activeTab === "history" && <WalletHistoryPage />}
    </div>
  );
}
