import styles from "./ProfilePage.module.css";
import Dialog from "./Dialog";
import { useState } from "react";
export default function ProfilePage() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className={styles.topActionsContainer}>
        <p>Verify your account for additional layers of security</p>
        <div className={styles.topActionsDiv}>
          <a href="#">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className={styles.alertIcon}
            >
              <g clip-path="url(#AttentionFilled_svg__a)">
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11m1.09-7.925.25-9.166h-2.844l.255 9.166h2.34Zm-2.255 3.644q.453.447 1.086.447.41 0 .754-.204.346-.211.556-.556a1.47 1.47 0 0 0-.243-1.847 1.49 1.49 0 0 0-1.067-.448q-.633 0-1.086.447a1.43 1.43 0 0 0-.448 1.074 1.46 1.46 0 0 0 .447 1.087Z"
                  clip-rule="evenodd"
                ></path>
              </g>
              <defs>
                <clipPath id="AttentionFilled_svg__a">
                  <path fill="#fff" d="M0 0h24v24H0z"></path>
                </clipPath>
              </defs>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
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
          </a>
          <a href="#">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className={styles.alertIcon}
            >
              <g clip-path="url(#AttentionFilled_svg__a)">
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11m1.09-7.925.25-9.166h-2.844l.255 9.166h2.34Zm-2.255 3.644q.453.447 1.086.447.41 0 .754-.204.346-.211.556-.556a1.47 1.47 0 0 0-.243-1.847 1.49 1.49 0 0 0-1.067-.448q-.633 0-1.086.447a1.43 1.43 0 0 0-.448 1.074 1.46 1.46 0 0 0 .447 1.087Z"
                  clip-rule="evenodd"
                ></path>
              </g>
              <defs>
                <clipPath id="AttentionFilled_svg__a">
                  <path fill="#fff" d="M0 0h24v24H0z"></path>
                </clipPath>
              </defs>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
            >
              <g fill="currentColor" clip-path="url(#Bank_svg__a)">
                <path
                  fill-rule="evenodd"
                  d="M4.127 17.55c0-.396.32-.717.717-.717h14.314a.717.717 0 1 1 0 1.435H4.844a.717.717 0 0 1-.717-.718m-2.128 2.786c0-.396.321-.717.717-.717h18.57a.717.717 0 1 1 0 1.434H2.716A.717.717 0 0 1 2 20.336Zm9.604-17.309a.72.72 0 0 1 .796 0l8.356 5.57a.717.717 0 0 1-.398 1.314H3.645a.717.717 0 0 1-.398-1.314zm.398 1.458L6.014 8.477h11.975z"
                  clip-rule="evenodd"
                ></path>
                <path d="M10.144 11.41c0-.198.16-.359.358-.359h2.996c.198 0 .359.16.359.359v3.924c0 .198-.16.358-.359.358h-2.995a.36.36 0 0 1-.359-.358zm-4.642 0c0-.198.16-.359.358-.359h2.996c.198 0 .359.16.359.359v3.924c0 .198-.16.358-.359.358H5.86a.36.36 0 0 1-.358-.358zm9.285 0c0-.198.16-.359.358-.359h2.996c.198 0 .359.16.359.359v3.924c0 .198-.16.358-.359.358h-2.996a.36.36 0 0 1-.358-.358z"></path>
              </g>
              <defs>
                <clipPath id="Bank_svg__a">
                  <path fill="#fff" d="M0 0h24v24H0z"></path>
                </clipPath>
              </defs>
            </svg>
          </a>
          <a href="#">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className={styles.alertIcon}
            >
              <g clip-path="url(#AttentionFilled_svg__a)">
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11m1.09-7.925.25-9.166h-2.844l.255 9.166h2.34Zm-2.255 3.644q.453.447 1.086.447.41 0 .754-.204.346-.211.556-.556a1.47 1.47 0 0 0-.243-1.847 1.49 1.49 0 0 0-1.067-.448q-.633 0-1.086.447a1.43 1.43 0 0 0-.448 1.074 1.46 1.46 0 0 0 .447 1.087Z"
                  clip-rule="evenodd"
                ></path>
              </g>
              <defs>
                <clipPath id="AttentionFilled_svg__a">
                  <path fill="#fff" d="M0 0h24v24H0z"></path>
                </clipPath>
              </defs>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
            >
              <g clip-path="url(#Phone_svg__a)">
                <rect
                  width="10"
                  height="16"
                  x="7"
                  y="4"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                  rx="1"
                ></rect>
                <circle cx="12" cy="17" r="1" fill="currentColor"></circle>
                <path
                  fill="currentColor"
                  d="M9 5a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1"
                ></path>
              </g>
              <defs>
                <clipPath id="Phone_svg__a">
                  <path fill="#fff" d="M0 0h24v24H0z"></path>
                </clipPath>
              </defs>
            </svg>
          </a>
          <a href="#">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className={styles.alertIcon}
            >
              <g clip-path="url(#AttentionFilled_svg__a)">
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11m1.09-7.925.25-9.166h-2.844l.255 9.166h2.34Zm-2.255 3.644q.453.447 1.086.447.41 0 .754-.204.346-.211.556-.556a1.47 1.47 0 0 0-.243-1.847 1.49 1.49 0 0 0-1.067-.448q-.633 0-1.086.447a1.43 1.43 0 0 0-.448 1.074 1.46 1.46 0 0 0 .447 1.087Z"
                  clip-rule="evenodd"
                ></path>
              </g>
              <defs>
                <clipPath id="AttentionFilled_svg__a">
                  <path fill="#fff" d="M0 0h24v24H0z"></path>
                </clipPath>
              </defs>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
            >
              <g
                fill="currentColor"
                fill-rule="evenodd"
                clip-path="url(#MailWide_svg__a)"
                clip-rule="evenodd"
              >
                <path d="M10.19 12.348a.86.86 0 0 1-.15 1.207L4.41 17.94a.86.86 0 1 1-1.057-1.356l5.63-4.386a.86.86 0 0 1 1.206.15Zm4.325-.06a.86.86 0 0 1 1.215-.037l5.117 4.825a.86.86 0 1 1-1.18 1.25l-5.117-4.824a.86.86 0 0 1-.035-1.215Z"></path>
                <path d="M2.192 6.196A.86.86 0 0 1 3.4 6.069l8.67 7.018 8.67-7.017a.86.86 0 0 1 1.082 1.336l-8.67 7.018a1.72 1.72 0 0 1-2.164 0l-8.67-7.018a.86.86 0 0 1-.126-1.209Z"></path>
                <path d="M2 6.72C2 5.77 2.77 5 3.72 5h16.7c.95 0 1.72.77 1.72 1.72v10.56c0 .95-.77 1.72-1.72 1.72H3.72C2.77 19 2 18.23 2 17.28zm18.421 0H3.72v10.56h16.702V6.72Z"></path>
              </g>
              <defs>
                <clipPath id="MailWide_svg__a">
                  <path fill="#fff" d="M0 0h24v24H0z"></path>
                </clipPath>
              </defs>
            </svg>
          </a>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.infoDiv}>
          <div className={styles.infoLabel}>Username</div>
          <div className={styles.infoValue}>Sai Sai</div>
        </div>
        <div className={styles.infoDiv}>
          <div className={styles.infoLabel}>Full Name</div>
          <div className={styles.infoValue}>Sai Sai</div>
        </div>
        <div className={styles.infoDiv}>
          <div className={styles.infoLabel}>Contact Number</div>
          <div className={styles.infoValue}>
            Sai Sai
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <g clip-path="url(#Attention_svg__a)">
                  <path
                    stroke="currentColor"
                    stroke-width="2"
                    d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="m13.34 5.91-.25 9.165h-2.339l-.255-9.166h2.844Zm-1.419 13.256q-.633 0-1.086-.447a1.46 1.46 0 0 1-.448-1.087 1.43 1.43 0 0 1 .447-1.074 1.5 1.5 0 0 1 1.087-.447q.607 0 1.068.447a1.47 1.47 0 0 1 .242 1.848q-.21.345-.556.556-.345.204-.754.204"
                  ></path>
                </g>
                <defs>
                  <clipPath id="Attention_svg__a">
                    <path fill="#fff" d="M0 0h24v24H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.infoDiv}>
          <div className={styles.infoLabel}>Email</div>
          <div className={styles.infoValue}>
            Sai Sai
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <g clip-path="url(#Attention_svg__a)">
                  <path
                    stroke="currentColor"
                    stroke-width="2"
                    d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="m13.34 5.91-.25 9.165h-2.339l-.255-9.166h2.844Zm-1.419 13.256q-.633 0-1.086-.447a1.46 1.46 0 0 1-.448-1.087 1.43 1.43 0 0 1 .447-1.074 1.5 1.5 0 0 1 1.087-.447q.607 0 1.068.447a1.47 1.47 0 0 1 .242 1.848q-.21.345-.556.556-.345.204-.754.204"
                  ></path>
                </g>
                <defs>
                  <clipPath id="Attention_svg__a">
                    <path fill="#fff" d="M0 0h24v24H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.infoDiv}>
          <div className={styles.infoLabel}>Birthday</div>
          <div className={styles.infoValue}>
            Sai Sai
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <g clip-path="url(#Calendar_svg__a)">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M16.546 4.773V2.955M7.455 4.773V2.955"
                  ></path>
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M5.636 4.773a1.818 1.818 0 0 0 3.637 0V2.955h5.454v1.818a1.818 1.818 0 1 0 3.637 0V2.955H19a3 3 0 0 1 3 3v13.09a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5.956a3 3 0 0 1 3-3h.636zm1.091 4.545a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10.546a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z"
                    clip-rule="evenodd"
                  ></path>
                  <rect
                    width="2"
                    height="2"
                    x="7"
                    y="11"
                    fill="currentColor"
                    rx="0.2"
                  ></rect>
                  <rect
                    width="2"
                    height="2"
                    x="11"
                    y="11"
                    fill="currentColor"
                    rx="0.2"
                  ></rect>
                  <rect
                    width="2"
                    height="2"
                    x="15"
                    y="11"
                    fill="currentColor"
                    rx="0.2"
                  ></rect>
                  <rect
                    width="2"
                    height="2"
                    x="7"
                    y="15"
                    fill="currentColor"
                    rx="0.2"
                  ></rect>
                  <rect
                    width="2"
                    height="2"
                    x="11"
                    y="15"
                    fill="currentColor"
                    rx="0.2"
                  ></rect>
                  <rect
                    width="2"
                    height="2"
                    x="15"
                    y="15"
                    fill="currentColor"
                    rx="0.2"
                  ></rect>
                </g>
                <defs>
                  <clipPath id="Calendar_svg__a">
                    <path fill="#fff" d="M0 0h24v24H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.infoDiv}>
          <div className={styles.infoLabel}>Preferred Language</div>
          <div className={styles.infoValue}>
            Sai Sai
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <g clip-path="url(#FullName_svg__a)">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m5 18 1.775-5.918a1 1 0 0 1 .237-.405l7.614-7.928a1 1 0 0 1 1.44-.002l3.265 3.382a1 1 0 0 1 .002 1.387l-7.617 7.932a1 1 0 0 1-.521.287z"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M3 21h18"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M13.293 8.707a1 1 0 1 0 1.414-1.414zm-2-2 2 2 1.414-1.414-2-2z"
                  ></path>
                </g>
                <defs>
                  <clipPath id="FullName_svg__a">
                    <path fill="#fff" d="M0 0h24v24H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.infoDiv}>
          <div className={styles.infoLabel}>Gender</div>
          <div className={styles.infoValue}>
            Sai Sai
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <g clip-path="url(#FullName_svg__a)">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m5 18 1.775-5.918a1 1 0 0 1 .237-.405l7.614-7.928a1 1 0 0 1 1.44-.002l3.265 3.382a1 1 0 0 1 .002 1.387l-7.617 7.932a1 1 0 0 1-.521.287z"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M3 21h18"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M13.293 8.707a1 1 0 1 0 1.414-1.414zm-2-2 2 2 1.414-1.414-2-2z"
                  ></path>
                </g>
                <defs>
                  <clipPath id="FullName_svg__a">
                    <path fill="#fff" d="M0 0h24v24H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>{" "}
        <div className={styles.infoDiv}>
          <div className={styles.infoLabel}>Password</div>
          <div className={styles.infoValue}>
            Sai Sai
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <g clip-path="url(#FullName_svg__a)">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m5 18 1.775-5.918a1 1 0 0 1 .237-.405l7.614-7.928a1 1 0 0 1 1.44-.002l3.265 3.382a1 1 0 0 1 .002 1.387l-7.617 7.932a1 1 0 0 1-.521.287z"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M3 21h18"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M13.293 8.707a1 1 0 1 0 1.414-1.414zm-2-2 2 2 1.414-1.414-2-2z"
                  ></path>
                </g>
                <defs>
                  <clipPath id="FullName_svg__a">
                    <path fill="#fff" d="M0 0h24v24H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.issue}>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
          >
            <g clip-path="url(#Livechat_svg__a)">
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M2 5.045C2 3.915 2.935 3 4.088 3h10.55c1.153 0 2.087.916 2.087 2.045v7.278c0 1.13-.934 2.045-2.088 2.045h-4.479l-3.762 2.53v-2.53H4.088C2.935 14.368 2 13.453 2 12.323zm2.088-.107a.11.11 0 0 0-.11.107v7.278c0 .06.05.107.11.107h10.55a.11.11 0 0 0 .11-.107V5.045a.11.11 0 0 0-.11-.107H4.087Zm3.384 13.35q-.14 0-.271-.034l3.6-2.658h3.88c1.821 0 3.297-1.446 3.297-3.23V6.811q0-.186-.02-.366H20.9c.607 0 1.099.482 1.099 1.077v9.689c0 .594-.492 1.076-1.099 1.076h-3.01V21l-4.115-2.713H7.472Z"
                clip-rule="evenodd"
              ></path>
            </g>
            <defs>
              <clipPath id="Livechat_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
        </button>
        <p>
          * Please contact Live Chat if you have any issue on personal details
        </p>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Contact Number Verification"
        footer={
          <>
            <button
              style={{
                background: "#d62828",
                color: "#fff",
                padding: "0.8rem 1.5rem",
                borderRadius: "0.5rem",
                border: "none",
              }}
            >
              Verify Now
            </button>
            <button
              style={{
                background: "#ccc",
                padding: "0.8rem 1.5rem",
                borderRadius: "0.5rem",
                border: "none",
              }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </>
        }
      >
        <p style={{ marginBottom: "1rem" }}>
          You are required to verify your contact number to improve your
          security level.
        </p>
        <p>
          Please select your preferred method to receive OTP:
          <strong> 09******1331</strong>
        </p>
      </Dialog>
    </>
  );
}
