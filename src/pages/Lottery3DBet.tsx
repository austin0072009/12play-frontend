import { useNavigate } from "react-router-dom";
import styles from "./Lottery3DBet.module.css";
import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

export default function Lottery3DBet() {
  const navigate = useNavigate();
  const [selectedNumber, setSelectedNumber] = useState("");
  const [selectedSet, setSelectedSet] = useState("");
  const [selectedPayout, setSelectedPayout] = useState("");
  const [betAmount, setBetAmount] = useState("");

  const sets = ["SET1", "SET2", "SET3"];
  const payouts = ["0.5x", "1x", "1.5x", "2x"];

  const handlePlaceBet = () => {
    if (selectedNumber && selectedSet && selectedPayout && betAmount) {
      navigate("/3d/bet-confirm", {
        state: { selectedNumber, selectedSet, selectedPayout, betAmount },
      });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>3D Lottery Bet</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.formSection}>
          {/* Number Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Select 3D Number</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={3}
              placeholder="000-999"
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Set Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Set</label>
            <div className={styles.buttonGroup}>
              {sets.map((set) => (
                <button
                  key={set}
                  className={`${styles.setBtn} ${
                    selectedSet === set ? styles.active : ""
                  }`}
                  onClick={() => setSelectedSet(set)}
                >
                  {set}
                </button>
              ))}
            </div>
          </div>

          {/* Payout Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Payout</label>
            <div className={styles.buttonGroup}>
              {payouts.map((payout) => (
                <button
                  key={payout}
                  className={`${styles.payoutBtn} ${
                    selectedPayout === payout ? styles.active : ""
                  }`}
                  onClick={() => setSelectedPayout(payout)}
                >
                  {payout}
                </button>
              ))}
            </div>
          </div>

          {/* Bet Amount */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Bet Amount (MYR)</label>
            <input
              type="number"
              placeholder="Enter amount"
              min="0"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className={styles.quickAmounts}>
            {[10, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                className={styles.quickBtn}
                onClick={() => setBetAmount(String(amount))}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Bet Summary */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Number:</span>
            <span className={styles.value}>{selectedNumber || "—"}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Set:</span>
            <span className={styles.value}>{selectedSet || "—"}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Payout:</span>
            <span className={styles.value}>{selectedPayout || "—"}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Amount:</span>
            <span className={styles.value}>MYR {betAmount || "0"}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.potential}`}>
            <span>Potential Win:</span>
            <span className={styles.value}>
              MYR{" "}
              {betAmount && selectedPayout
                ? (
                    parseFloat(betAmount) *
                    parseFloat(selectedPayout.slice(0, -1))
                  ).toFixed(2)
                : "0"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            className={styles.confirmBtn}
            disabled={!selectedNumber || !selectedSet || !selectedPayout || !betAmount}
            onClick={handlePlaceBet}
          >
            Confirm Bet
          </button>
        </div>
      </div>
    </div>
  );
}
