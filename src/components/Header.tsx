import styles from "./Header.module.css";
import { useSidebarStore } from "../store/sidebar";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { open } = useSidebarStore();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.leftHeader}>
        <button onClick={open} className={styles.menuButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
            className={styles.menuIcon}
          >
            <g clip-path="url(#Menu_svg__a)">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
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
        <svg
          viewBox="0 0 413 122"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.logoImage}
        >
          <path
            d="M143.609 3.42062H174.637C183.028 3.42062 189.479 4.07844 193.993 5.39818C198.503 6.7138 201.895 8.61734 204.164 11.1047C206.434 13.592 207.972 16.6056 208.773 20.1414C209.579 23.6812 209.982 29.1534 209.982 36.5703V46.8897C209.982 54.4504 209.201 59.9637 207.639 63.4296C206.076 66.8954 203.211 69.5513 199.042 71.4055C194.869 73.2597 189.417 74.1848 182.687 74.1848H174.419V121.897H143.613V3.42062H143.609ZM174.415 23.6895V53.8378C175.295 53.8872 176.047 53.9118 176.684 53.9118C179.513 53.9118 181.478 53.217 182.576 51.8274C183.674 50.4378 184.22 47.5475 184.22 43.1566V33.4251C184.22 29.3754 183.587 26.7401 182.317 25.5231C181.051 24.3021 178.415 23.6895 174.415 23.6895Z"
            fill="white"
          ></path>
          <path
            d="M249.644 3.42062V98.1867H268.379V121.897H218.838V3.42062H249.644Z"
            fill="white"
          ></path>
          <path
            d="M332.828 3.42062L350.445 121.893H318.961L317.308 100.6H306.29L304.44 121.893H272.589L288.303 3.42062H332.828ZM316.498 79.5994C314.94 66.18 313.374 49.5949 311.807 29.84C308.67 52.5263 306.697 69.1114 305.895 79.5994H316.498Z"
            fill="white"
          ></path>
          <path
            d="M412.317 3.42062L389.853 79.0115V121.893H361.312V79.0115L339.653 3.42062H367.956C372.379 26.5468 374.871 42.1082 375.438 50.1089C377.144 37.4706 380.006 21.9051 384.019 3.42062H412.317Z"
            fill="white"
          ></path>
          <path
            d="M49.9814 2.26533V120.737H20.4169V57.2215C20.4169 48.0491 20.199 42.5399 19.759 40.6816C19.3191 38.8274 18.1145 37.4254 16.137 36.4757C14.1594 35.526 9.75618 35.0491 2.92727 35.0491H0V21.235C14.2951 18.1597 25.149 11.8365 32.5658 2.26533H49.9814Z"
            fill="#BA1818"
          ></path>
          <path
            d="M125.206 100.543V120.741H60.1528L60.1693 103.836C79.4391 72.3224 90.8932 52.8223 94.5277 45.3315C98.1621 37.8448 99.9793 32.0026 99.9793 27.8049C99.9793 24.5857 99.4284 22.1806 98.3306 20.5977C97.2288 19.0149 95.5596 18.2214 93.3107 18.2214C91.0618 18.2214 89.3885 19.1012 88.2908 20.8568C87.1889 22.6123 86.6421 26.1028 86.6421 31.3201V42.5892H60.1528V38.2724C60.1528 31.6367 60.4941 26.4071 61.1766 22.5753C61.859 18.7477 63.5406 14.9776 66.2253 11.2692C68.9059 7.56073 72.3964 4.75681 76.6886 2.85326C80.9808 0.949718 86.1282 0 92.1308 0C103.885 0 112.778 2.91493 118.805 8.74479C124.828 14.5747 127.842 21.9545 127.842 30.8802C127.842 37.6598 126.148 44.834 122.756 52.3948C119.364 59.9555 109.378 76.0061 92.7886 100.547H125.206V100.543Z"
            fill="#BA1818"
          ></path>
        </svg>
      </div>
      <div className={styles.rightHeader}>
        <LanguageSwitcher />
        <button
          onClick={() => {
            navigate("/login");
          }}
          className={styles.loginButton}
        >
          Login
        </button>
        <button
          onClick={() => {
            navigate("/register");
          }}
          className={styles.registerButton}
        >
          Join Now
        </button>
      </div>
    </header>
  );
}
