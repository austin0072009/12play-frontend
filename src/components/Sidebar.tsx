import styles from "./Sidebar.module.css";
import { useSidebarStore } from "../store/sidebar";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";
import LanguageSwitcher from "./LanguageSwitcher";

// Icon Components (declared before NAV_ITEMS)
const ReferIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px" className={styles.navItemRightIcon}>
    <g clipPath="url(#Refer_svg__a)">
      <path fill="currentColor" d="M12.037 19.908v-.815q-1.196-.064-1.904-.664c-.708-.6-.718-.972-.737-1.714h1.489q.034.483.346.757.313.268.806.327v-1.865l-.469-.118q-.918-.22-1.45-.698-.527-.483-.527-1.289 0-.615.312-1.089a2.26 2.26 0 0 1 .865-.761 3.2 3.2 0 0 1 1.27-.342v-.82h.58v.82a3.1 3.1 0 0 1 1.275.337q.546.282.85.761.302.474.312 1.08H13.57q-.073-.768-.952-.884v1.767l.347.088a4.2 4.2 0 0 1 1.128.415q.493.269.776.694.283.42.283 1.025 0 .946-.669 1.528-.668.581-1.865.645v.815zm-.869-6.177q0 .328.249.518.25.19.62.303V12.93q-.42.059-.644.278a.7.7 0 0 0-.225.522Zm2.437 3.184a.6.6 0 0 0-.26-.513q-.253-.19-.727-.322v1.714q.454-.064.718-.298a.74.74 0 0 0 .268-.581Z"></path>
      <path fill="currentColor" d="M16.3 10.233v-1.17c-5.846-.584-7.307 2.925-7.307 3.51s-.731.585-.731 0-.936-2.597.73-5.264c1.462-2.34 5.116-3.315 7.308-3.51v-1.47c0-.585.126-.844 1.2 0s3 2.43 3.927 3.171c.73.585.87.997.073 1.5-1.074.677-2.446 1.733-3.5 2.5s-1.7 1.319-1.7.733"></path>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="bevel" strokeWidth="2" d="M6.5 6.5H5a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9"></path>
    </g>
  </svg>
);

const AccountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px" className={styles.navItemRightIcon}>
    <g clipPath="url(#Profile_svg__a)">
      <circle cx="3.622" cy="3.622" r="3.622" fill="currentColor" transform="matrix(-1 0 0 1 15.622 6.33)"></circle>
      <path fill="currentColor" fillRule="evenodd" d="M12 21.055a9.055 9.055 0 1 1 0-18.11 9.055 9.055 0 0 1 0 18.11M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10" clipRule="evenodd"></path>
      <path fill="currentColor" fillRule="evenodd" d="M19.56 18.134a8.97 8.97 0 0 0-7.53-4.087 8.97 8.97 0 0 0-7.564 4.14a9.68 9.68 0 0 0 7.526 3.577 9.68 9.68 0 0 0 7.567-3.63Z" clipRule="evenodd"></path>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
    </g>
  </svg>
);

// const RedemptionIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px" className={styles.navItemRightIcon}>
//     <g stroke="currentColor" strokeWidth="2" clipPath="url(#Redemption_svg__a)">
//       <rect width="18" height="13" x="3" y="8" rx="1"></rect>
//       <circle cx="9.5" cy="5.5" r="2.5"></circle>
//       <circle cx="14.5" cy="5.5" r="2.5"></circle>
//       <path strokeLinecap="round" d="M3 16h18M7 12l3.536-4M17 12l-4-4.5"></path>
//     </g>
//   </svg>
// );

const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navItemRightIcon}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
  </svg>
);

// const VipIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px" className={styles.navItemRightIcon}>
//     <g clipPath="url(#VIP_svg__a)">
//       <path stroke="currentColor" strokeWidth="2" d="m21.523 10.271-8.747 10.773a1 1 0 0 1-1.552 0L2.477 10.27a1 1 0 0 1-.042-1.205l3.266-4.641A1 1 0 0 1 6.52 4h10.962a1 1 0 0 1 .818.425l3.266 4.64a1 1 0 0 1-.042 1.206ZM3 9.684h18m-9 10.421 4.5-10.42M12.11 20.82 7.5 9.684m3.346-5.299L7.77 9.773M16 9.21 13 4"></path>
//     </g>
//   </svg>
// );

// const AffiliateIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px" className={styles.navItemRightIcon}>
//     <g clipPath="url(#Affiliate_svg__a)">
//       <circle cx="8" cy="16" r="5" stroke="currentColor" strokeWidth="2"></circle>
//       <circle cx="5" cy="5" r="3" fill="currentColor"></circle>
//       <circle cx="19" cy="5" r="3" fill="currentColor"></circle>
//       <circle cx="19" cy="19" r="3" fill="currentColor"></circle>
//       <path stroke="currentColor" strokeWidth="2" d="m5 5 1.615 5.6m4.846 1.68 6.462-6.72M19 19l-5.923-1.68"></path>
//     </g>
//   </svg>
// );

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navItemRightIcon}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" x2="12" y1="15" y2="3"></line>
  </svg>
);

const NAV_ITEMS = [
  // {
  //   id: "12goal",
  //   label: "12Goal",
  //   icon: (
  //     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px" className={styles.navItemRightIcon}>
  //       <g clipPath="url(#OneTwoGoal_svg__a)">
  //         <path fill="currentColor" fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10M9.513 4.698a1 1 0 0 0-1.003 0l-1.115.643c-.31.18-.501.51-.501.87v1.286c0 .359.191.69.501.87l1.115.643c.31.179.693.179 1.003 0l1.115-.644c.31-.18.502-.51.502-.869V6.21c0-.358-.191-.69-.502-.869zm4.956 0a1 1 0 0 1 1.003 0l1.115.643c.31.18.502.51.502.87v1.286c0 .359-.192.69-.502.87l-1.115.643c-.31.179-.693.179-1.003 0l-1.115-.644c-.31-.18-.502-.51-.502-.869V6.21c0-.358.192-.69.502-.869zM8.51 15.187a1 1 0 0 1 1.003 0l1.115.644c.31.179.502.51.502.869v1.287c0 .358-.191.69-.502.869l-1.115.643a1 1 0 0 1-1.003 0l-1.115-.643c-.31-.18-.501-.51-.501-.87V16.7c0-.358.191-.69.501-.868zm6.962 0a1 1 0 0 0-1.003 0l-1.115.644c-.31.179-.502.51-.502.869v1.287c0 .358.192.69.502.869l1.115.643c.31.18.693.18 1.003 0l1.115-.643c.31-.18.502-.51.502-.87V16.7c0-.358-.192-.69-.502-.868zM5.395 10.055c.31-.179.693-.179 1.003 0l1.115.644c.31.18.502.51.502.869v1.287c0 .358-.191.69-.502.869l-1.115.643a1 1 0 0 1-1.003 0l-1.115-.643c-.31-.18-.501-.51-.501-.87v-1.286c0-.359.191-.69.501-.87zm13.273 0a1 1 0 0 0-1.003 0l-1.115.644c-.31.18-.502.51-.502.869v1.287c0 .358.191.69.502.869l1.114.643a1 1 0 0 0 1.004 0l1.114-.643c.31-.18.502-.51.502-.87v-1.286c0-.359-.191-.69-.502-.87z" clipRule="evenodd"></path>
  //       </g>
  //     </svg>
  //   ),
  //   route: "/home",
  // },
  { id: "refer", label: "Refer & Earn", icon: <ReferIcon />, route: "/promotion" },
  { id: "account", label: "Account", icon: <AccountIcon />, route: "/profile" },
  // { id: "redemption", label: "Redemption", icon: <RedemptionIcon />, route: null },
  { id: "inbox", label: "Feedback", icon: <InboxIcon />, route: null },
  // { id: "vip", label: "VIP", icon: <VipIcon />, route: null },
  // { id: "affiliate", label: "12 Affiliate", icon: <AffiliateIcon />, route: null },
  { id: "download", label: "Download App", icon: <DownloadIcon />, route: null },
];

export default function Sidebar() {

  const token = useUserStore((s) => s.token);
  const { isOpen, close } = useSidebarStore();
  const navigate = useNavigate();

  const handleNavClick = (route: string | null) => {
    if (route) {
      navigate(route);
      close();
    }
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.show : styles.hide}`}
      onClick={close}
    >
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.slideIn : styles.slideOut}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <svg width="181" height="30" viewBox="0 0 181 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-1.2517e-06 29.4886V0.397738H12.017C14.1951 0.397738 16.0748 0.79073 17.6562 1.57671C19.2472 2.35323 20.4735 3.47065 21.3352 4.92899C22.197 6.37785 22.6278 8.0966 22.6278 10.0852C22.6278 12.1023 22.1875 13.8163 21.3068 15.2273C20.4261 16.6288 19.1761 17.6989 17.5568 18.4375C15.9375 19.1667 14.0199 19.5313 11.804 19.5313H4.20454V13.9915H10.4972C11.5578 13.9915 12.4432 13.8542 13.1534 13.5796C13.8731 13.2955 14.4176 12.8693 14.7869 12.3011C15.1562 11.7235 15.3409 10.9849 15.3409 10.0852C15.3409 9.18562 15.1562 8.44225 14.7869 7.85512C14.4176 7.25853 13.8731 6.81346 13.1534 6.5199C12.4337 6.21687 11.5483 6.06535 10.4972 6.06535H7.03125V29.4886H-1.2517e-06ZM16.3778 16.1932L23.6222 29.4886H15.9517L8.84943 16.1932H16.3778ZM26.4844 29.4886V0.397738H46.7685V6.10796H33.5156V12.0739H45.7315V17.7983H33.5156V23.7784H46.7685V29.4886H26.4844ZM61.9247 29.4886H51.1719V0.397738H61.9105C64.8745 0.397738 67.4266 0.980124 69.5668 2.1449C71.7164 3.3002 73.3736 4.96687 74.5384 7.1449C75.7031 9.31346 76.2855 11.9082 76.2855 14.929C76.2855 17.9593 75.7031 20.5635 74.5384 22.7415C73.383 24.9195 71.7306 26.5909 69.581 27.7557C67.4313 28.911 64.8793 29.4886 61.9247 29.4886ZM58.2031 23.4943H61.6548C63.2836 23.4943 64.6615 23.2197 65.7884 22.6705C66.9247 22.1118 67.7817 21.2074 68.3594 19.9574C68.9465 18.6979 69.2401 17.0218 69.2401 14.929C69.2401 12.8362 68.9465 11.1695 68.3594 9.92899C67.7723 8.67899 66.9058 7.77937 65.7599 7.23012C64.6236 6.67141 63.2221 6.39206 61.5554 6.39206H58.2031V23.4943Z" fill="#FF0202" />
            <path d="M106.797 10.9375H99.6946C99.5999 10.2083 99.4058 9.5502 99.1122 8.96308C98.8187 8.37596 98.4304 7.87406 97.9474 7.4574C97.4645 7.04073 96.8916 6.7235 96.2287 6.50569C95.5753 6.27842 94.8509 6.16478 94.0554 6.16478C92.6444 6.16478 91.4276 6.51043 90.4048 7.20171C89.3916 7.893 88.6103 8.89206 88.0611 10.1989C87.5213 11.5057 87.2514 13.0871 87.2514 14.9432C87.2514 16.875 87.526 18.4943 88.0753 19.8011C88.634 21.0985 89.4152 22.0786 90.419 22.7415C91.4323 23.3949 92.6302 23.7216 94.0128 23.7216C94.7893 23.7216 95.4948 23.6222 96.1293 23.4233C96.7732 23.2244 97.3366 22.9356 97.8196 22.5568C98.312 22.1686 98.7145 21.6998 99.027 21.1506C99.349 20.5919 99.5715 19.9621 99.6946 19.2614L106.797 19.304C106.674 20.5919 106.3 21.8608 105.675 23.1108C105.059 24.3608 104.212 25.5019 103.132 26.5341C102.053 27.5568 100.736 28.3712 99.1832 28.9773C97.6397 29.5833 95.8688 29.8864 93.8707 29.8864C91.2382 29.8864 88.8802 29.3087 86.7969 28.1534C84.723 26.9886 83.0848 25.2936 81.8821 23.0682C80.6794 20.8428 80.0781 18.1345 80.0781 14.9432C80.0781 11.7424 80.6889 9.02937 81.9105 6.80399C83.1321 4.57861 84.7846 2.88827 86.8679 1.73296C88.9512 0.577662 91.2855 1.00136e-05 93.8707 1.00136e-05C95.6321 1.00136e-05 97.2609 0.246222 98.7571 0.738647C100.253 1.2216 101.57 1.93183 102.706 2.86933C103.842 3.79736 104.766 4.93846 105.476 6.29262C106.186 7.64679 106.626 9.19509 106.797 10.9375ZM138.278 14.9432C138.278 18.1439 137.662 20.857 136.431 23.0824C135.2 25.3078 133.533 26.9981 131.431 28.1534C129.338 29.3087 126.99 29.8864 124.386 29.8864C121.772 29.8864 119.419 29.304 117.326 28.1392C115.233 26.9744 113.571 25.2841 112.34 23.0682C111.119 20.8428 110.508 18.1345 110.508 14.9432C110.508 11.7424 111.119 9.02937 112.34 6.80399C113.571 4.57861 115.233 2.88827 117.326 1.73296C119.419 0.577662 121.772 1.00136e-05 124.386 1.00136e-05C126.99 1.00136e-05 129.338 0.577662 131.431 1.73296C133.533 2.88827 135.2 4.57861 136.431 6.80399C137.662 9.02937 138.278 11.7424 138.278 14.9432ZM131.09 14.9432C131.09 13.0493 130.82 11.4489 130.281 10.1421C129.75 8.83524 128.983 7.84565 127.979 7.17331C126.985 6.50096 125.787 6.16478 124.386 6.16478C122.994 6.16478 121.796 6.50096 120.792 7.17331C119.788 7.84565 119.016 8.83524 118.477 10.1421C117.946 11.4489 117.681 13.0493 117.681 14.9432C117.681 16.8371 117.946 18.4375 118.477 19.7443C119.016 21.0511 119.788 22.0407 120.792 22.7131C121.796 23.3854 122.994 23.7216 124.386 23.7216C125.787 23.7216 126.985 23.3854 127.979 22.7131C128.983 22.0407 129.75 21.0511 130.281 19.7443C130.82 18.4375 131.09 16.8371 131.09 14.9432ZM147.912 29.4886L139.446 0.397738H147.216L151.605 19.4602H151.847L156.861 0.397738H163.196L168.21 19.5029H168.452L172.855 0.397738H180.611L172.159 29.4886H165.384L160.142 11.8466H159.915L154.673 29.4886H147.912Z" fill="white" />
          </svg>

          <button className={styles.closeButton} onClick={close}>
            <XMarkIcon className={styles.closeIcon} />
          </button>
        </div>

        {!token && (
          <div className={styles.headerAction}>
            <button className={styles.joinNowBtn} onClick={() => {
              navigate("/register");
            }}>Join Now</button>
            <div className={styles.alreadyHave}>
              You already have an account? <a href="#/login">Login</a>
            </div>
          </div>
        ) || (
            <div className={styles.welcomeSection}>
              <div className={styles.welcomeGradient}></div>
              <h2 className={styles.welcomeTitle}>Welcome Back! 🎮</h2>
              <p className={styles.welcomeSubtitle}>Ready to play and win?</p>
            </div>
          )}


        <nav className={styles.navContainer}>
          {/* <div>
            <video
              style={{ width: "100%" }}
              autoPlay
              loop
              playsInline
              preload="auto"
              src="https://www.RedCowaffth.com/images/free12/free30-m.mp4"
            ></video>
          </div> */}

          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className={styles.navItem}
              onClick={() => handleNavClick(item.route)}
              style={{ cursor: item.route ? "pointer" : "default" }}
            >
              <div className={styles.navItemContainer}>
                <div className={styles.navItemLeft}>
                  {item.icon}
                  <span className={styles.navLabel}>{item.label}</span>
                </div>
              </div>
            </div>
          ))}


        </nav>
        {/* Language Switcher Section */}
        <div className={styles.languageSwitcherContainer}>
          <LanguageSwitcher />
        </div>
      </aside>
    </div>
  );
}
