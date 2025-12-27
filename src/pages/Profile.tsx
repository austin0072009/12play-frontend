import { useState, type SetStateAction } from "react";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import ProfilePage from "../components/ProfilePage";
export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleChangeTab = (page: SetStateAction<string>) => {
    setActiveTab(page);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        <div
          className={`${styles.tabItem}  ${
            activeTab === "profile" && styles.active
          }`}
          onClick={() => handleChangeTab("profile")}
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
              strokeWidth="2"
              clipPath="url(#Profile2_svg__a)"
            >
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M4 17a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"></path>
            </g>
            <defs>
              <clipPath id="Profile2_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <span>Profile</span>
        </div>
        <div
          className={`${styles.tabItem} ${
            activeTab === "banking" && styles.active
          }`}
          onClick={() => handleChangeTab("banking")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
            className={styles.tabItemIcon}
          >
            <g clipPath="url(#Banking_svg__a)">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.292 18h15.416M2 21h20M21 9H3l9-6z"
              ></path>
              <rect
                width="4"
                height="5"
                x="10"
                y="11"
                fill="currentColor"
                rx="0.5"
              ></rect>
              <rect
                width="4"
                height="5"
                x="5"
                y="11"
                fill="currentColor"
                rx="0.5"
              ></rect>
              <rect
                width="4"
                height="5"
                x="15"
                y="11"
                fill="currentColor"
                rx="0.5"
              ></rect>
            </g>
            <defs>
              <clipPath id="Banking_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <span>Banking</span>
        </div>
      </div>

      {activeTab === "profile" && <ProfilePage />}
    </div>
  );
}
