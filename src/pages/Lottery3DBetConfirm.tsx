import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Lottery3DBetConfirm.module.css";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, TrashIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { placeBet } from "../services/lottery";
import Dialog from "../components/Dialog";
import { useAlertStore } from "../store/alert";

type BetItem = {
  num: string;
  amount: number;
};

export default function Lottery3DBetConfirm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showAlert } = useAlertStore();
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
      showAlert(t("lottery3d.confirm.missingIssue"));
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
      showAlert(error.message || t("lottery3d.confirm.failedToBet"));
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
        <h1 className={styles.title}>{t("lottery3d.confirm.title")}</h1>
      </header>

      <div className={styles.content}>
        {/* Info Card */}
        <div className={styles.infoCard}>
          <div>
            <div className={styles.round}>{state.round}</div>
            <div className={styles.time}>{t("lottery3d.draw")} {state.drawTime}</div>
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
            {t("lottery3d.confirm.noNumbersSelected")}
          </div>
        )}

        {/* Notice */}
        <div className={styles.notice}>
          {t("lottery3d.confirm.notice")}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            {t("lottery3d.confirm.cancel")}
          </button>
          <button
            className={styles.confirmBtn}
            disabled={loading || items.length === 0 || totalAmount <= 0}
            onClick={handleConfirm}
          >
            {loading ? t("lottery3d.confirm.processing") : t("lottery3d.confirm.confirmBtn")}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onClose={handleSuccessClose}>
        <div className={styles.successModal}>
          <CheckCircleIcon className={styles.successIcon} />
          <h2 className={styles.successTitle}>{t("lottery3d.confirm.success")}</h2>
          <div className={styles.successInfo}>
            <div className={styles.successRow}>
              <span>{t("lottery3d.confirm.successRound")}</span>
              <span>{state?.round}</span>
            </div>
            <div className={styles.successRow}>
              <span>{t("lottery3d.confirm.successDrawTime")}</span>
              <span>{state?.drawTime}</span>
            </div>
            <div className={styles.successRow}>
              <span>{t("lottery3d.confirm.successNumbers")}</span>
              <span>{items.length}</span>
            </div>
            <div className={styles.successRow}>
              <span>{t("lottery3d.confirm.successTotal")}</span>
              <span className={styles.successAmount}>
                MMK {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          {/* <button className={styles.successBtn} onClick={handleSuccessClose}>
            {t("lottery3d.confirm.ok")}
          </button> */}
        </div>
      </Dialog>
    </div>
  );
}
