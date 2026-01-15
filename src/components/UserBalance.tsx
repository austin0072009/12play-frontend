import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";

interface UserBalanceProps {
  headerStyle?: boolean;
}

export default function UserBalance({ headerStyle = false }: UserBalanceProps) {
  const navigate = useNavigate();
  const userInfo = useUserStore((s) => s.userInfo);
  const token = useUserStore((s) => s.token);

  if (!token) {
    return null;
  }

  const rawBalance = userInfo?.balance;
  const balanceNumber = typeof rawBalance === "number"
    ? rawBalance
    : typeof rawBalance === "string"
    ? Number(rawBalance)
    : 0;
  const displayBalance = Number.isFinite(balanceNumber) ? balanceNumber : 0;

  const handleWalletClick = () => {
    navigate("/wallet");
  };

  if (headerStyle) {
    return (
      <button
        onClick={handleWalletClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.6rem 1rem",
          background: "transparent",
          border: "1px solid #444",
          borderRadius: "0.8rem",
          color: "#fff",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "600",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.borderColor = "#cb0000";
          el.style.color = "#cb0000";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.borderColor = "#444";
          el.style.color = "#fff";
        }}
      >
        {/* Wallet Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <path d="M1 10h22" />
          <circle cx="17" cy="15" r="2" />
        </svg>
        <span>MMK {displayBalance.toFixed(2)}</span>
      </button>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.8rem",
        padding: "1rem 1.2rem",
        background: "linear-gradient(135deg, rgba(203, 0, 0, 0.1) 0%, rgba(203, 0, 0, 0.05) 100%)",
        border: "1px solid rgba(203, 0, 0, 0.3)",
        borderRadius: "0.8rem",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onClick={handleWalletClick}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "linear-gradient(135deg, rgba(203, 0, 0, 0.15) 0%, rgba(203, 0, 0, 0.1) 100%)";
        el.style.borderColor = "rgba(203, 0, 0, 0.5)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "linear-gradient(135deg, rgba(203, 0, 0, 0.1) 0%, rgba(203, 0, 0, 0.05) 100%)";
        el.style.borderColor = "rgba(203, 0, 0, 0.3)";
      }}
    >
      {/* Wallet Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#cb0000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <path d="M1 10h22" />
        <circle cx="17" cy="15" r="2" />
      </svg>

      {/* Balance Text */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span style={{ fontSize: "0.75rem", color: "#999", fontWeight: "500" }}>
          Balance
        </span>
        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: "700",
            color: "#cb0000",
          }}
        >
          MMK {displayBalance.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
