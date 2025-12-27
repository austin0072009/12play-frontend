import styles from "./ProfilePage.module.css";
import { useState, useMemo, useEffect } from "react";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";
import Dialog from "./Dialog";

export default function ProfilePage() {
  const navigate = useNavigate();
  const userInfo = useUserStore((s) => s.userInfo);
  const logout = useUserStore((s) => s.logout);
  const token = useUserStore((s) => s.token);

  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Memoized user data with safe defaults
  const username = useMemo(() => {
    if (!userInfo) return "—";
    return (userInfo as any)?.username || (userInfo as any)?.user_name || "—";
  }, [userInfo]);

  const fullName = useMemo(() => {
    if (!userInfo) return "—";
    return (userInfo as any)?.fullname || (userInfo as any)?.full_name || (userInfo as any)?.name || "—";
  }, [userInfo]);

  const accountId = useMemo(() => {
    if (!userInfo) return "—";
    return (userInfo as any)?.id || (userInfo as any)?.account_id || "—";
  }, [userInfo]);

  const contactPhone = useMemo(() => {
    if (!userInfo) return "—";
    return (userInfo as any)?.phone || (userInfo as any)?.contact || "—";
  }, [userInfo]);

  const passwordDisplay = useMemo(() => {
    if (!userInfo) return "••••••••";
    const pwd = (userInfo as any)?.password || "••••••••";
    return showPassword ? pwd : "••••••••";
  }, [userInfo, showPassword]);

  // Check if user needs phone verification
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Mark as loaded once we have token
    setIsLoading(false);

    // Check if phone verification is needed
    const needsVerification = !(userInfo as any)?.phone_verified;
    if (needsVerification && userInfo && Object.keys(userInfo).length > 0) {
      setOpen(true);
    }
  }, [token, userInfo, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEditPassword = () => {
    navigate("/change-password");
  };

  const handleContactSupport = () => {
    setAlertMessage("Opening live chat support...");
    setAlertOpen(true);
    // Implement live chat integration here
  };

  return (
    <>
      {isLoading ? (
        <div className={styles.infoContainer}>
          <div style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
            Loading profile...
          </div>
        </div>
      ) : (
        <div className={styles.infoContainer}>
          <div className={styles.infoDiv}>
            <div className={styles.infoLabel}>Account ID</div>
            <div className={styles.infoValue}>{accountId}</div>
          </div>
          <div className={styles.infoDiv}>
            <div className={styles.infoLabel}>Username</div>
            <div className={styles.infoValue}>{username}</div>
          </div>
          <div className={styles.infoDiv}>
            <div className={styles.infoLabel}>Full Name</div>
            <div className={styles.infoValue}>{fullName}</div>
          </div>
          <div className={styles.infoDiv}>
            <div className={styles.infoLabel}>Contact</div>
            <div className={styles.infoValue}>{contactPhone}</div>
          </div>
          <div className={styles.infoDiv}>
            <div className={styles.infoLabel}>Password</div>
            <div className={styles.infoValue}>
              {passwordDisplay}
              <button
                type="button"
                onClick={handleEditPassword}
                style={{
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.3rem',
                  cursor: 'pointer',
                  marginLeft: '0.5rem',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a00000')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="24px"
                  height="24px"
                >
                  <g clipPath="url(#FullName_svg__a)">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m5 18 1.775-5.918a1 1 0 0 1 .237-.405l7.614-7.928a1 1 0 0 1 1.44-.002l3.265 3.382a1 1 0 0 1 .002 1.387l-7.617 7.932a1 1 0 0 1-.521.287z"
                    ></path>
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
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
          <div className={styles.infoDiv} style={{ marginTop: "1.5rem" }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "1rem",
                background: "#ff3333",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.3s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#cc2222")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ff3333")}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <div className={styles.issue}>
        <button onClick={handleContactSupport}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
          >
            <g clipPath="url(#Livechat_svg__a)">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M2 5.045C2 3.915 2.935 3 4.088 3h10.55c1.153 0 2.087.916 2.087 2.045v7.278c0 1.13-.934 2.045-2.088 2.045h-4.479l-3.762 2.53v-2.53H4.088C2.935 14.368 2 13.453 2 12.323zm2.088-.107a.11.11 0 0 0-.11.107v7.278c0 .06.05.107.11.107h10.55a.11.11 0 0 0 .11-.107V5.045a.11.11 0 0 0-.11-.107H4.087Zm3.384 13.35q-.14 0-.271-.034l3.6-2.658h3.88c1.821 0 3.297-1.446 3.297-3.23V6.811q0-.186-.02-.366H20.9c.607 0 1.099.482 1.099 1.077v9.689c0 .594-.492 1.076-1.099 1.076h-3.01V21l-4.115-2.713H7.472Z"
                clipRule="evenodd"
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
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="Alert"
      >
        {alertMessage}
      </Dialog>
    </>
  );
}
