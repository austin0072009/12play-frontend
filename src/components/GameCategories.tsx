import styles from "./GameCategories.module.css";

export default function GameCategories() {
  return (
    <div className={styles.gameCategories}>
      <div className={styles.gameCategoryItem}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className={styles.gameCategoryItemIcon}
        >
          <g clip-path="url(#Esport_svg__a)">
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M11.724 3.193c-4.35-.042-7.702-.074-9.211 4.958-1.65 5.5-2.75 12.65 1.1 12.65 2.852 0 3.873-2.512 4.622-4.355.22-.54.416-1.023.628-1.368.14-.226.399-.327.664-.327H10.9v.005h3.484c.263 0 .52.1.66.323.215.345.414.829.637 1.37.758 1.842 1.791 4.352 4.677 4.352 3.894 0 2.781-7.144 1.112-12.64-1.432-4.714-4.502-4.98-8.507-4.96q-.633-.001-1.24-.008ZM10.9 9.8a1.1 1.1 0 0 0-1.1-1.1H8.7V7.6a1.1 1.1 0 0 0-2.2 0v1.1H5.4a1.1 1.1 0 0 0 0 2.2h1.1V12a1.1 1.1 0 0 0 2.2 0v-1.1h1.1a1.1 1.1 0 0 0 1.1-1.1m5.5-1.1a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2m1.1 3.3a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0m-2.2-2.2a1.1 1.1 0 1 0-2.2 0 1.1 1.1 0 0 0 2.2 0m3.3-1.1a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2"
              clip-rule="evenodd"
            ></path>
          </g>
          <defs>
            <clipPath id="Esport_svg__a">
              <path fill="#fff" d="M0 0h24v24H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <span>Esports</span>
      </div>
      <div className={styles.gameCategoryItem}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className={styles.gameCategoryItemIcon}
        >
          <g clip-path="url(#Sports_svg__a)">
            <path
              fill-rule="evenodd"
              d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18m2.437-5.099L12 14.495 9.564 15.9v2.814L12 20.12l2.437-1.406zm-7.595-5.217 2.437 1.407v2.813l-2.437 1.407-2.436-1.407v-2.813zm12.753 1.407-2.437-1.407-2.437 1.407v2.813l2.437 1.407 2.436-1.407v-2.813ZM9.185 5.057l2.437 1.407v2.813l-2.437 1.407L6.75 9.277V6.464zm8.533 1.407-2.436-1.407-2.437 1.407v2.813l2.437 1.407 2.436-1.407z"
              clip-rule="evenodd"
            ></path>
          </g>
          <defs>
            <clipPath id="Sports_svg__a">
              <path fill="#fff" d="M0 0h24v24H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <span>Sports</span>
      </div>
      <div className={styles.gameCategoryItem}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className={styles.gameCategoryItemIcon}
        >
          <g
            fill="currentColor"
            fill-rule="evenodd"
            clip-path="url(#Casino_svg__a)"
            clip-rule="evenodd"
          >
            <path d="m11.452 21.141 6.075 1.004a2.993 2.993 0 0 0 3.44-2.465l1.91-11.565a2.993 2.993 0 0 0-2.465-3.44l-5.535-.915c.174.25.313.533.407.841l3.404 11.217a2.993 2.993 0 0 1-1.995 3.733z"></path>
            <path d="M1.195 7.72A2.993 2.993 0 0 1 3.19 3.987l6.98-2.118a2.993 2.993 0 0 1 3.733 1.995l3.404 11.216a2.993 2.993 0 0 1-1.995 3.733l-6.98 2.119a2.993 2.993 0 0 1-3.733-1.995zm5.808 7.11c-.86-.734-.215-2.43.478-4.25.3-.785.607-1.593.806-2.357.59.524 1.295 1.025 1.98 1.512 1.587 1.127 3.067 2.178 2.759 3.267-.581 2.055-2.267 1.013-2.267 1.013-.348-.22-.438.91 1.085 1.224l-1.307.397-1.308.397c1.092-1.108.39-1.997.222-1.621 0 0-.822 1.803-2.448.418"></path>
          </g>
          <defs>
            <clipPath id="Casino_svg__a">
              <path fill="#fff" d="M0 0h24v24H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <span>Live Casino</span>
      </div>
      <div className={styles.gameCategoryItem}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className={styles.gameCategoryItemIcon}
        >
          <g clip-path="url(#Slots_svg__a)">
            <path
              fill="currentColor"
              d="M10.43 11.97v-2h.408v.307c.203 0 .508-.23.813-.23s.763.307 1.17.23c.325-.062.339-.18.305-.23l.305.307c-.017.077-.132.4-.458 1.077-.325.677-.373 1.974-.356 2.538h-1.474c0-.769.356-1.538 1.017-2.538-.204.154-.814-.154-1.017-.154-.163 0-.272.462-.306.692zm6.57.215v-1.57h.338v.242c.169 0 .422-.181.676-.181.253 0 .634.241.971.18.27-.047.282-.14.254-.18l.253.241c-.014.06-.11.314-.38.845s-.31 1.55-.296 1.992h-1.225c0-.604.296-1.207.845-1.992-.169.12-.676-.12-.845-.12-.135 0-.225.362-.253.543zm-12 0v-1.57h.338v.242c.169 0 .422-.181.676-.181.253 0 .633.241.971.18.27-.047.282-.14.254-.18l.253.241c-.014.06-.11.314-.38.845s-.31 1.55-.296 1.992H5.591c0-.604.296-1.207.845-1.992-.169.12-.676-.12-.845-.12-.135 0-.225.362-.253.543z"
            ></path>
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M5.14 20.571c0 .79.64 1.429 1.43 1.429h10.577a1.43 1.43 0 0 0 1.429-1.429v-1.38h2.382a.953.953 0 0 0 .953-.953V6.134a.953.953 0 0 0-.953-.952h-2.382V3.429c0-.79-.64-1.429-1.43-1.429H6.57c-.79 0-1.43.64-1.43 1.429v1.753H2.95a.953.953 0 0 0-.953.952v12.104c0 .526.426.953.953.953h2.19zM3.377 16c0 .526.427.952.953.952h4.002V7.048H4.33A.953.953 0 0 0 3.377 8zm5.86-8.952v9.904h5.242V7.048zm6.147 0h4.192c.527 0 .953.426.953.952v8a.953.953 0 0 1-.953.952h-4.192z"
              clip-rule="evenodd"
            ></path>
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M9 6v12m6-12v12m6-12v12M3 6v12"
            ></path>
          </g>
          <defs>
            <clipPath id="Slots_svg__a">
              <path fill="#fff" d="M0 0h24v24H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <span>Slots</span>
      </div>
      <div className={styles.gameCategoryItem}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
          className={styles.gameCategoryItemIcon}
        >
          <g fill="currentColor" clip-path="url(#Arcade_svg__a)">
            <path
              fill-rule="evenodd"
              d="M2.029 13.27c.658-.298 4.873-1.925 8.11-3.166v3.633c0 .478.889.865 1.986.865s1.986-.387 1.986-.865V10c2.97 1.194 7 2.837 7.849 3.27 1.301.667 1.164 1.932 0 2.53-1.165.6-7.123 3.13-8.288 3.463-1.164.333-2.602.266-3.356 0-.6-.213-4.21-1.739-6.689-2.787l-1.598-.675c-1.439-.608-1.028-2.064 0-2.53Zm8.63 7.458c-.987-.267-6.621-2.597-9.315-3.729-.206-.086-.206.333-.206.932 0 .6.206.932.89 1.332.686.4 4.727 2.197 7.26 3.13 2.535.931 3.7.598 4.795.265 1.096-.332 6.644-2.796 7.877-3.395 1.08-.525 1.056-1.101 1.034-1.639a5 5 0 0 1-.007-.225c0-.48-.32-.466-.48-.4-2.305.977-7.122 3.023-7.944 3.396-1.028.466-2.671.666-3.904.333m-5.315-5.194c.908 0 1.644-.417 1.644-.932 0-.514-.736-.932-1.644-.932s-1.643.418-1.643.932c0 .515.736.932 1.643.932"
              clip-rule="evenodd"
            ></path>
            <path d="M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0"></path>
          </g>
          <defs>
            <clipPath id="Arcade_svg__a">
              <path fill="#fff" d="M0 0h24v24H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <span>Arcade</span>
      </div>
      <div className={styles.gameCategoryItem}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
          className={styles.gameCategoryItemIcon}
        >
          <g clip-path="url(#Lottery_svg__a)">
            <circle
              cx="12"
              cy="10"
              r="9"
              stroke="currentColor"
              stroke-width="2"
            ></circle>
            <circle
              cx="12"
              cy="10"
              r="2"
              stroke="currentColor"
              stroke-width="2"
            ></circle>
            <path
              stroke="currentColor"
              stroke-width="2"
              d="m7.766 2.667 3.175 5.5m2.118 3.666 3.175 5.5M3.532 10h6.351m4.234 0h6.35M7.766 17.333l3.175-5.5m2.118-3.666 3.175-5.5"
            ></path>
            <rect
              width="12"
              height="3"
              x="6"
              y="19"
              fill="currentColor"
              rx="1"
            ></rect>
          </g>
          <defs>
            <clipPath id="Lottery_svg__a">
              <path fill="#fff" d="M0 0h24v24H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <span>Lottery</span>
      </div>
      <div className={styles.gameCategoryItem}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
          className={styles.gameCategoryItemIcon}
        >
          <g clip-path="url(#ThreeD_svg__a)">
            <path
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2 5.5 12 2l10 3-9.5 4z"
            ></path>
            <path
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2 5.5 12.27 9 22 5v12.5L12.27 22 2 17.5z"
            ></path>
            <path fill="currentColor" d="M12 22V9l9.5-4v12z"></path>
          </g>
          <defs>
            <clipPath id="ThreeD_svg__a">
              <path fill="#fff" d="M0 0h24v24H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <span>3D</span>
      </div>
    </div>
  );
}
