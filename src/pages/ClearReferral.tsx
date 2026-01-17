import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearReferralCode, getReferralCode } from "../utils/referral";

export default function ClearReferral() {
  const navigate = useNavigate();
  const [cleared, setCleared] = useState(false);
  const [previousCode, setPreviousCode] = useState<string | null>(null);

  useEffect(() => {
    const code = getReferralCode();
    setPreviousCode(code);
    clearReferralCode();
    setCleared(true);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#1a1a2e",
      color: "#fff",
      padding: 20,
      textAlign: "center"
    }}>
      {cleared ? (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
          <h1 style={{ marginBottom: 12 }}>Referral Code Cleared</h1>
          {previousCode ? (
            <p style={{ color: "#aaa", marginBottom: 24 }}>
              Removed: <code style={{ background: "#333", padding: "2px 8px", borderRadius: 4 }}>{previousCode}</code>
            </p>
          ) : (
            <p style={{ color: "#aaa", marginBottom: 24 }}>No referral code was stored.</p>
          )}
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 16
            }}
          >
            Go to Register
          </button>
        </>
      ) : (
        <p>Clearing...</p>
      )}
    </div>
  );
}
