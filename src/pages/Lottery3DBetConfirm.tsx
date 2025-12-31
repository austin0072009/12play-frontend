import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Lottery3DBetConfirm.module.css";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, TrashIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { placeBet } from "../services/lottery";
import Dialog from "../components/Dialog";

type BetItem = {
  num: string;
  amount: number;
};

export default function Lottery3DBetConfirm() {
  const navigate = useNavigate();
  const { state } = useLocation() as any;

  const [items, setItems] = useState<BetItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  /* 初始化：从上页展开号码 */
  useEffect(() => {
    if (!state?.numbers || !state?.amount) return;
    setItems(
      state.numbers.map((n: string) => ({
        num: n,
        amount: state.amount,
      }))
    );
  }, [state]);

  /* 合计金额 */
  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.amount, 0),
    [items]
  );

  /* 修改单号金额 */
  const updateAmount = (num: string, amount: number) => {
    setItems((prev) =>
      prev.map((i) => (i.num === num ? { ...i, amount } : i))
    );
  };

  /* 删除单个号码 */
  const removeItem = (num: string) => {
    setItems((prev) => prev.filter((i) => i.num !== num));
  };

  /* 确认下注 */
  const handleConfirm = async () => {
    if (items.length === 0 || totalAmount <= 0) return;
    if (!state?.issue) {
      alert("Missing issue information. Please try again.");
      return;
    }

    setLoading(true);
    try {
      // Prepare bet data according to API structure
      const betInfo = items.map((item) => ({
        number: item.num,
        amount: item.amount,
      }));

      await placeBet({
        gameId: 2, // 2 for 3D
        issue: state.issue,
        betInfo,
      });

      // Success - show success modal
      setLoading(false);
      setShowSuccess(true);
    } catch (error: any) {
      setLoading(false);
      alert(error.message || "Failed to place bet. Please try again.");
      console.error("Place bet error:", error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // Navigate back to 3D home after closing success modal
    navigate("/3d");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>Confirm Bet</h1>
      </header>

      <div className={styles.content}>
        {/* Info Card */}
        <div className={styles.infoCard}>
          <div>
            <div className={styles.round}>{state.round}</div>
            <div className={styles.time}>Draw {state.drawTime}</div>
          </div>
          <div className={styles.total}>
            MMK {totalAmount.toLocaleString()}
          </div>
        </div>

        {/* Bet List */}
        <div className={styles.list}>
          {items.map((item) => (
            <div key={item.num} className={styles.row}>
              <div className={styles.num}>{item.num}</div>

              <input
                type="number"
                min={0}
                value={item.amount}
                onChange={(e) =>
                  updateAmount(item.num, Number(e.target.value))
                }
                className={styles.amountInput}
              />

              <button
                className={styles.deleteBtn}
                onClick={() => removeItem(item.num)}
                aria-label="Remove"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className={styles.empty}>
            No numbers selected. Please go back and select numbers.
          </div>
        )}

        {/* Notice */}
        <div className={styles.notice}>
          You can adjust or remove any number before confirming the bet.
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={styles.confirmBtn}
            disabled={loading || items.length === 0 || totalAmount <= 0}
            onClick={handleConfirm}
          >
            {loading ? "Processing..." : "Confirm Bet"}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onClose={handleSuccessClose}>
        <div className={styles.successModal}>
          <CheckCircleIcon className={styles.successIcon} />
          <h2 className={styles.successTitle}>Bet Placed Successfully!</h2>
          <div className={styles.successInfo}>
            <div className={styles.successRow}>
              <span>Round:</span>
              <span>{state?.round}</span>
            </div>
            <div className={styles.successRow}>
              <span>Draw Time:</span>
              <span>{state?.drawTime}</span>
            </div>
            <div className={styles.successRow}>
              <span>Numbers:</span>
              <span>{items.length}</span>
            </div>
            <div className={styles.successRow}>
              <span>Total Amount:</span>
              <span className={styles.successAmount}>
                MMK {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          <button className={styles.successBtn} onClick={handleSuccessClose}>
            OK
          </button>
        </div>
      </Dialog>
    </div>
  );
}
