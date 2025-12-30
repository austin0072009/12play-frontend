import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Lottery3DBetConfirm.module.css";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, TrashIcon } from "@heroicons/react/24/solid";

type BetItem = {
  num: string;
  amount: number;
};

export default function Lottery3DBetConfirm() {
  const navigate = useNavigate();
  const { state } = useLocation() as any;

  const [items, setItems] = useState<BetItem[]>([]);
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
  const handleConfirm = () => {
    if (items.length === 0 || totalAmount <= 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/3d/bet-success", {
        state: {
          round: state.round,
          drawTime: state.drawTime,
          bets: items,
          totalAmount,
        },
      });
    }, 1200);
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
    </div>
  );
}
