import styles from "./Sidebar.module.css";
import { useSidebarStore } from "../store/sidebar";
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowRightEndOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
export default function Sidebar() {
  const { isOpen, close } = useSidebarStore();

  const [shownSubItem, setShownSubItem] = useState(null);

  const showSubItem = (item) => {
    setShownSubItem(item);
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.show : styles.hide}`}
      onClick={close}
    >
      <aside
        className={`${styles.sidebar} ${
          isOpen ? styles.slideIn : styles.slideOut
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
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
          <button className={styles.closeButton} onClick={close}>
            <XMarkIcon className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.headerAction}>
          <button className={styles.joinNowBtn}>Join Now</button>
          <div className={styles.alreadyHave}>
            You already have an account? <a href="#">Login</a>
          </div>
        </div>
        <nav className={styles.navContainer}>
          <div>
            <video
              style={{ width: "100%" }}
              autoPlay
              loop
              playsInline
              preload="auto"
              src="https://www.12playaffth.com/images/free12/free30-m.mp4"
            ></video>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemContainer}>
              <div className={styles.navItemLeft}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="24px"
                  height="24px"
                  className={styles.navItemRightIcon}
                >
                  <g clip-path="url(#OneTwoGoal_svg__a)">
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10M9.513 4.698a1 1 0 0 0-1.003 0l-1.115.643c-.31.18-.501.51-.501.87v1.286c0 .359.191.69.501.87l1.115.643c.31.179.693.179 1.003 0l1.115-.644c.31-.18.502-.51.502-.869V6.21c0-.358-.191-.69-.502-.869zm4.956 0a1 1 0 0 1 1.003 0l1.115.643c.31.18.502.51.502.87v1.286c0 .359-.192.69-.502.87l-1.115.643c-.31.179-.693.179-1.003 0l-1.115-.644c-.31-.18-.502-.51-.502-.869V6.21c0-.358.192-.69.502-.869zM8.51 15.187a1 1 0 0 1 1.003 0l1.115.644c.31.179.502.51.502.869v1.287c0 .358-.191.69-.502.869l-1.115.643a1 1 0 0 1-1.003 0l-1.115-.643c-.31-.18-.501-.51-.501-.87V16.7c0-.358.191-.69.501-.868zm6.962 0a1 1 0 0 0-1.003 0l-1.115.644c-.31.179-.502.51-.502.869v1.287c0 .358.192.69.502.869l1.115.643c.31.18.693.18 1.003 0l1.115-.643c.31-.18.502-.51.502-.87V16.7c0-.358-.192-.69-.502-.868zM5.395 10.055c.31-.179.693-.179 1.003 0l1.115.644c.31.18.502.51.502.869v1.287c0 .358-.191.69-.502.869l-1.115.643a1 1 0 0 1-1.003 0l-1.115-.643c-.31-.18-.501-.51-.501-.87v-1.286c0-.359.191-.69.501-.87zm13.273 0a1 1 0 0 0-1.003 0l-1.115.644c-.31.18-.502.51-.502.869v1.287c0 .358.191.69.502.869l1.114.643a1 1 0 0 0 1.004 0l1.114-.643c.31-.18.502-.51.502-.87v-1.286c0-.359-.191-.69-.502-.87z"
                      clip-rule="evenodd"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="OneTwoGoal_svg__a">
                      <path fill="#fff" d="M0 0h24v24H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
                <span className={styles.navLabel}>12Goal</span>
              </div>
            </div>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemContainer}>
              <div className={styles.navItemLeft}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="24px"
                  height="24px"
                  className={styles.navItemRightIcon}
                >
                  <g clip-path="url(#Refer_svg__a)">
                    <path
                      fill="currentColor"
                      d="M12.037 19.908v-.815q-1.196-.064-1.904-.664c-.708-.6-.718-.972-.737-1.714h1.489q.034.483.346.757.313.268.806.327v-1.865l-.469-.118q-.918-.22-1.45-.698-.527-.483-.527-1.289 0-.615.312-1.089a2.26 2.26 0 0 1 .865-.761 3.2 3.2 0 0 1 1.27-.342v-.82h.58v.82a3.1 3.1 0 0 1 1.275.337q.546.282.85.761.302.474.312 1.08H13.57q-.073-.768-.952-.884v1.767l.347.088a4.2 4.2 0 0 1 1.128.415q.493.269.776.694.283.42.283 1.025 0 .946-.669 1.528-.668.581-1.865.645v.815zm-.869-6.177q0 .328.249.518.25.19.62.303V12.93q-.42.059-.644.278a.7.7 0 0 0-.225.522Zm2.437 3.184a.6.6 0 0 0-.26-.513q-.253-.19-.727-.322v1.714q.454-.064.718-.298a.74.74 0 0 0 .268-.581Z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M16.3 10.233v-1.17c-5.846-.584-7.307 2.925-7.307 3.51s-.731.585-.731 0-.936-2.597.73-5.264c1.462-2.34 5.116-3.315 7.308-3.51v-1.47c0-.585.126-.844 1.2 0s3 2.43 3.927 3.171c.73.585.87.997.073 1.5-1.074.677-2.446 1.733-3.5 2.5s-1.7 1.319-1.7.733"
                    ></path>
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="bevel"
                      stroke-width="2"
                      d="M6.5 6.5H5a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="Refer_svg__a">
                      <path fill="#fff" d="M0 0h24v24H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
                <span className={styles.navLabel}>Refer & Earn</span>
              </div>
            </div>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemContainer}>
              <div className={styles.navItemLeft}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="24px"
                  height="24px"
                  className={styles.navItemRightIcon}
                >
                  <g clip-path="url(#Profile_svg__a)">
                    <circle
                      cx="3.622"
                      cy="3.622"
                      r="3.622"
                      fill="currentColor"
                      transform="matrix(-1 0 0 1 15.622 6.33)"
                    ></circle>
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M12 21.055a9.055 9.055 0 1 1 0-18.11 9.055 9.055 0 0 1 0 18.11M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10"
                      clip-rule="evenodd"
                    ></path>
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M19.56 18.134a8.97 8.97 0 0 0-7.53-4.087 8.97 8.97 0 0 0-7.564 4.14 9.68 9.68 0 0 0 7.526 3.577 9.68 9.68 0 0 0 7.567-3.63Z"
                      clip-rule="evenodd"
                    ></path>
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="2"
                    ></circle>
                  </g>
                  <defs>
                    <clipPath id="Profile_svg__a">
                      <path fill="#fff" d="M0 0h24v24H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
                <span className={styles.navLabel}>Account</span>
              </div>
            </div>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemContainer}>
              <div className={styles.navItemLeft}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="24px"
                  height="24px"
                  className={styles.navItemRightIcon}
                >
                  <g
                    stroke="currentColor"
                    stroke-width="2"
                    clip-path="url(#Redemption_svg__a)"
                  >
                    <rect width="18" height="13" x="3" y="8" rx="1"></rect>
                    <circle cx="9.5" cy="5.5" r="2.5"></circle>
                    <circle cx="14.5" cy="5.5" r="2.5"></circle>
                    <path
                      stroke-linecap="round"
                      d="M3 16h18M7 12l3.536-4M17 12l-4-4.5"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="Redemption_svg__a">
                      <path fill="#fff" d="M0 0h24v24H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
                <span className={styles.navLabel}>Redemption</span>
              </div>
            </div>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemContainer}>
              <div className={styles.navItemLeft}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className={styles.navItemRightIcon}
                >
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
                <span className={styles.navLabel}>Inbox</span>
              </div>
            </div>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemContainer}>
              <div className={styles.navItemLeft}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="24px"
                  height="24px"
                  className={styles.navItemRightIcon}
                >
                  <g clip-path="url(#VIP_svg__a)">
                    <path
                      stroke="currentColor"
                      stroke-width="2"
                      d="m21.523 10.271-8.747 10.773a1 1 0 0 1-1.552 0L2.477 10.27a1 1 0 0 1-.042-1.205l3.266-4.641A1 1 0 0 1 6.52 4h10.962a1 1 0 0 1 .818.425l3.266 4.64a1 1 0 0 1-.042 1.206ZM3 9.684h18m-9 10.421 4.5-10.42M12.11 20.82 7.5 9.684m3.346-5.299L7.77 9.773M16 9.21 13 4"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="VIP_svg__a">
                      <path fill="#fff" d="M0 0h24v24H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
                <span className={styles.navLabel}>VIP</span>
              </div>
            </div>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemContainer}>
              <div className={styles.navItemLeft}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="24px"
                  height="24px"
                  className={styles.navItemRightIcon}
                >
                  <g clip-path="url(#Affiliate_svg__a)">
                    <circle
                      cx="8"
                      cy="16"
                      r="5"
                      stroke="currentColor"
                      stroke-width="2"
                    ></circle>
                    <circle cx="5" cy="5" r="3" fill="currentColor"></circle>
                    <circle cx="19" cy="5" r="3" fill="currentColor"></circle>
                    <circle cx="19" cy="19" r="3" fill="currentColor"></circle>
                    <path
                      stroke="currentColor"
                      stroke-width="2"
                      d="m5 5 1.615 5.6m4.846 1.68 6.462-6.72M19 19l-5.923-1.68"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="Affiliate_svg__a">
                      <path fill="#fff" d="M0 0h24v24H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
                <span className={styles.navLabel}>12 Affiliate</span>
              </div>
            </div>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemContainer}>
              <div className={styles.navItemLeft}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-download size-6 shrink-0"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
                <span className={styles.navLabel}>Download App</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </div>
  );
}
