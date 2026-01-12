import styles from "./Header.module.css";
import { useSidebarStore } from "../store/sidebar";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";
import UserBalance from "./UserBalance";
import logoImg from '../assets/rclogowhite.png';
import { useTranslation } from "react-i18next";

export default function Header() {
  const { open } = useSidebarStore();
  const navigate = useNavigate();
  const token = useUserStore(s => s.token);
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={styles.leftHeader}>
        <button onClick={open} className={styles.menuButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className={styles.menuIcon}
          >
            <g clipPath="url(#Menu_svg__a)">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M3 5h11.363M3 12h15M3 19h11.363"
              ></path>
              <path
                fill="currentColor"
                d="M22.368 11.232a.5.5 0 0 1 .01.877l-4.383 2.47a.5.5 0 0 1-.745-.435v-4.81a.5.5 0 0 1 .735-.441z"
              ></path>
            </g>
            <defs>
              <clipPath id="Menu_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
        </button>
         <img src={logoImg} alt={t("header.logoAlt")}
       className={styles.logoImage} />
        
      </div>
      <div className={styles.rightHeader}>
        <UserBalance headerStyle={true} />
        {!token && (
          <>
            <button
              onClick={() => {
                navigate("/login");
              }}
              className={styles.loginButton}
            >
              {t("header.login")}
            </button>
            <button
              onClick={() => {
                navigate("/register");
              }}
              className={styles.registerButton}
            >
              {t("header.join")}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
