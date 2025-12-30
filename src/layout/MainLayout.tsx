import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import styles from "./MainLayout.module.css";
import { Outlet } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useUserStore } from "../store/user";
import { fetchBalance } from "../services/api";
import { loginApi } from "../services/auth";

export default function MainLayout() {
  const token = useUserStore((s) => s.token);
  const setToken = useUserStore((s) => s.setToken);
  const setUserInfo = useUserStore((s) => s.setUserInfo);
  const [isAutoLoginAttempted, setIsAutoLoginAttempted] = useState(false);

  // Memoize syncBalance function
  const syncBalance = useCallback(async () => {
    if (!token) return;
    try {
      const userInfo = useUserStore.getState().userInfo;
      const balanceRes = await fetchBalance();
      console.log("Fetched balance response:", balanceRes);
      // balanceRes structure: { status: { errorCode: 0, ... }, data: <number>, url: "" }
      if (balanceRes && balanceRes.status && Number(balanceRes.status.errorCode) === 0 && typeof balanceRes.data === 'number') {
        console.log("Fetched balance:", balanceRes.data);
        // Data is the balance number directly, merge it with existing member data
        setUserInfo({ ...userInfo, balance: balanceRes.data });
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  }, [token, setUserInfo]);

  // Auto-login on app load if no token but credentials exist
  useEffect(() => {
    // Check if token has expired
    const expirationTime = localStorage.getItem("RedCow-token-expiration");
    if (expirationTime && Date.now() > Number(expirationTime)) {
      console.log("=== TOKEN EXPIRED ===");
      // Clear expired token and credentials
      localStorage.removeItem("RedCow-token-expiration");
      localStorage.removeItem("RedCow-username");
      localStorage.removeItem("RedCow-password");
      // Note: token will be cleared because we won't attempt auto-login
    }
    
    if (!token && !isAutoLoginAttempted) {
      attemptAutoLogin();
    } else if (token && !isAutoLoginAttempted) {
      // Token exists, fetch balance
      syncBalance();
    }
    setIsAutoLoginAttempted(true);
  }, []);

  // Fetch balance when token changes (after manual login)
  useEffect(() => {
    if (token && isAutoLoginAttempted) {
      syncBalance();
    }
  }, [token]);

  const attemptAutoLogin = async () => {
    try {
      const storedUsername = localStorage.getItem("RedCow-username");
      const storedPasswordEncoded = localStorage.getItem("RedCow-password");

      if (storedUsername && storedPasswordEncoded) {
        const storedPassword = atob(storedPasswordEncoded); // Decode from Base64
        console.log("=== ATTEMPTING AUTO-LOGIN ===", { username: storedUsername });
        const res = await loginApi({ name: storedUsername, password: storedPassword, remember: true });
        
        if (res && res.status && Number(res.status.errorCode) === 0 && res.data) {
          const newToken = String(res.data.token || "");
          const member = res.data.member || {};
          const yzflag = !!res.data.yzflag;
          const qk_pwd = !!res.data.qk_pwd;

          console.log("=== AUTO-LOGIN MEMBER DATA ===", member);
          console.log("=== AUTO-LOGIN TOKEN ===", newToken);

          if (newToken) {
            console.log("=== AUTO-LOGIN SUCCESS ===");
            setToken(newToken);
            
            // Store token expiration time (24 hours from now)
            const expirationTime = Date.now() + 24 * 60 * 60 * 1000;
            localStorage.setItem("RedCow-token-expiration", String(expirationTime));
            console.log("=== TOKEN EXPIRATION SET ===", new Date(expirationTime).toISOString());
            
            // Fetch balance first, then set all data together
            let balance = 0;
            try {
              const balanceRes = await fetchBalance(newToken);
              console.log("=== AUTO-LOGIN BALANCE RESPONSE ===", balanceRes);
              if (balanceRes && balanceRes.status && Number(balanceRes.status.errorCode) === 0 && typeof balanceRes.data === 'number') {
                console.log("Balance response full:", balanceRes);
                console.log("Balance response data:", balanceRes.data);
                balance = balanceRes.data;
              }
            } catch (err) {
              console.error("Failed to fetch balance after auto-login:", err);
            }
            
            // Set all user info at once (member + balance)
            const finalUserInfo = { ...member, yzflag, qk_pwd, balance };
            console.log("=== AUTO-LOGIN FINAL USER INFO ===", finalUserInfo);
            setUserInfo(finalUserInfo);
          }
        } else {
          console.log("=== AUTO-LOGIN FAILED ===", res);
          // Clear stored credentials if auto-login fails
          localStorage.removeItem("RedCow-username");
          localStorage.removeItem("RedCow-password");
          localStorage.removeItem("RedCow-token-expiration");
        }
      } else {
        console.log("=== NO STORED CREDENTIALS FOR AUTO-LOGIN ===");
      }
    } catch (error) {
      console.error("=== AUTO-LOGIN ERROR ===", error);
      // Clear stored credentials on error
      localStorage.removeItem("RedCow-username");
      localStorage.removeItem("RedCow-password");
      localStorage.removeItem("RedCow-token-expiration");
    }
  };

  // Fetch balance and sync user info on mount or when token changes
  useEffect(() => {
    if (token) {
      syncBalance();
    }
  }, [token, syncBalance]);

  // Auto-refresh balance every 5 seconds when logged in
  useEffect(() => {
    if (!token) return;

    const intervalId = setInterval(() => {
      syncBalance();
    }, 5000); // 5 seconds

    return () => clearInterval(intervalId);
  }, [token, syncBalance]);

  return (
    <div className={styles.appWrapper}>
      <Header />
      <div className={styles.contentArea}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet /> {/* nested routes render here */}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
