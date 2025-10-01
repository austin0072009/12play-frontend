import styles from "../pages/Wallet.module.css";

export default function WalletHistoryPage() {
  return (
    <div className={styles.subTabContainer}>
      <div className={`${styles.subTabItem} ${styles.active}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
          className={styles.subTabItemIcon}
        >
          <g clip-path="url(#FastDeposit_svg__a)">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
              d="M4 20h17a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-8M2 11h6m-5 5h3M5 7h4"
            ></path>
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M17.65 7.24c.448.701 1.217 1.727 1.88 2.109.238.138.47.375.47.651v4.217a.52.52 0 0 1-.24.432c-.701.449-1.727 1.218-2.109 1.88-.138.24-.375.471-.651.471H8.739a.5.5 0 0 1-.465-.686l3.6-9A.5.5 0 0 1 12.338 7h4.879c.176 0 .338.092.432.24Zm-3.22 7.834v.653h.465v-.653q.957-.051 1.492-.515.535-.465.535-1.223 0-.484-.227-.82a1.7 1.7 0 0 0-.62-.555 3.4 3.4 0 0 0-.903-.332l-.277-.07v-1.414q.702.093.761.707h1.188a1.6 1.6 0 0 0-.25-.864 1.7 1.7 0 0 0-.68-.61 2.5 2.5 0 0 0-1.02-.269v-.656h-.464v.656a2.6 2.6 0 0 0-1.016.274 1.8 1.8 0 0 0-.691.61q-.25.378-.25.87 0 .645.421 1.032.426.382 1.16.558l.376.094v1.492a1.18 1.18 0 0 1-.645-.262q-.25-.218-.277-.605h-1.192q.024.89.59 1.371.567.48 1.524.531m-.496-3.875a.5.5 0 0 1-.2-.414q0-.241.18-.418.18-.175.516-.223v1.297a1.6 1.6 0 0 1-.496-.242m1.543 1.723a.48.48 0 0 1 .207.41q0 .277-.215.465-.21.187-.574.238v-1.37q.378.104.582.257"
              clip-rule="evenodd"
            ></path>
          </g>
          <defs>
            <clipPath id="FastDeposit_svg__a">
              <path fill="#fff" d="M0 0h24v24H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <span>Fast Deposit</span>
      </div>
      <div className={`${styles.subTabItem}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
          className={styles.subTabItemIcon}
        >
          <g clip-path="url(#BankTransfer_svg__a)">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 3.512A9 9 0 0 1 20.294 15.5c-.431.833-1.394 2.5-1.794 2.5m-3 2.294a9 9 0 0 1-11-13.27"
            ></path>
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m18.211 16 .286 2.042 2.042-.286M5.5 8.024 5.02 6.02l-2.005.48"
            ></path>
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
              d="M8.024 16.005h8.004"
            ></path>
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M11.733 6.077 7.186 9.125c-.34.229-.183.771.224.771v5.634c0 .26.205.47.458.47h8.356c.253 0 .458-.21.458-.47V9.896c.313 0 .437-.414.179-.594l-4.62-3.22a.45.45 0 0 0-.508-.005m-2.148 4.758a.58.58 0 0 0-.572.587v3.287a.58.58 0 0 0 .572.587.58.58 0 0 0 .572-.587v-3.287a.58.58 0 0 0-.572-.587m1.946.587a.58.58 0 0 1 .572-.587.58.58 0 0 1 .573.587v3.287a.58.58 0 0 1-.573.587.58.58 0 0 1-.572-.587zm3.09-.587a.58.58 0 0 0-.572.587v3.287a.58.58 0 0 0 .573.587.58.58 0 0 0 .572-.587v-3.287a.58.58 0 0 0-.572-.587Z"
              clip-rule="evenodd"
            ></path>
          </g>
          <defs>
            <clipPath id="BankTransfer_svg__a">
              <path fill="#fff" d="M0 0h24v24H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <span>Bank Transfer</span>
      </div>
      <div className={`${styles.subTabItem}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
          className={styles.subTabItemIcon}
        >
          <g clip-path="url(#Crypto_svg__a)">
            <path
              fill-rule="evenodd"
              d="M9.412 21.66c5.334 1.429 10.818-1.737 12.247-7.072 1.43-5.334-1.736-10.818-7.07-12.247C9.253.91 3.77 4.077 2.34 9.41.91 14.747 4.077 20.23 9.41 21.66ZM8.97 6.427l2.276.61.576-1.928 1.07.227-.54 2.016.73.196.181.05.654-1.868 1.11.298-.614 1.935q1.883.686 2.393 1.559.368.63.164 1.39-.44 1.643-2.585 1.305 1.806.72 1.983 1.866.07.446-.071.974-.14.523-.398.876a1.7 1.7 0 0 1-.615.54 2.8 2.8 0 0 1-.771.266 3.8 3.8 0 0 1-.95.035q-.6-.046-1.312-.193l-.541 1.826-1.11-.298.486-1.814-1.11-.298-.487 1.815-1.125-.242.556-1.855-.61-.164.005-.017-1.747-.587.69-1.243.833.223c.345.092.559.006.684-.109l1.414-5.278c-.01-.67-1.006-.984-1.502-1.058zm5.04 7.836c.045-.166.088-.378.056-.583a1.2 1.2 0 0 0-.206-.523 1.6 1.6 0 0 0-.461-.401q-.518-.312-1.476-.563l-.666-.178-.699 2.609.507.136c.81.216 1.331.246 1.678.235.366-.014.664-.036.811-.14.244-.173.376-.29.456-.592m.308-3.23q.242-.225.326-.56.09-.335.052-.558a.8.8 0 0 0-.188-.397 2 2 0 0 0-.334-.314 2.3 2.3 0 0 0-.486-.258 10 10 0 0 0-1.184-.386l-.3-.08-.67 2.505.506.136q1.696.454 2.278-.088"
              clip-rule="evenodd"
            ></path>
          </g>
          <defs>
            <clipPath id="Crypto_svg__a">
              <path d="M0 0h24v24H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <span>Crypto</span>
      </div>
    </div>
  );
}
