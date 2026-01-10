import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PromotionDetail.module.css";
import { fetchActivityDetail } from "../services/api";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useAppStore } from "../store/app";
import type { ActivityDetail } from "../services/types";
import FirstDepositBonus from "../components/FirstDepositBonus";
import CheckinCalendar from "../components/CheckinCalendar";

// Special event IDs
const FIRST_DEPOSIT_EVENT_ID = 29;
const CHECKIN_EVENT_ID = 32;

export default function PromotionDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const appStore = useAppStore();
  const domain = appStore.data?.domain || "";
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivityDetail = async () => {
      if (!id) {
        setError("No promotion ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await fetchActivityDetail(id);
        if (res?.data) {
          console.log("Fetched activity detail:", res.data);
          setActivity(res.data as ActivityDetail);
        } else {
          setError("Failed to load promotion details");
        }
      } catch (err) {
        console.error("Error loading activity detail:", err);
        setError("Failed to load promotion details");
      } finally {
        setLoading(false);
      }
    };

    loadActivityDetail();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack}>
            <ChevronLeftIcon className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>Promotion Details</h1>
          <span></span>
        </div>
        <div className={styles.loadingContainer}>Loading...</div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack}>
            <ChevronLeftIcon className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>Promotion Details</h1>
          <span></span>
        </div>
        <div className={styles.errorContainer}>
          {error || "Promotion not found"}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>Promotion Details</h1>
        <span></span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Promotion Image */}
        <div className={styles.imageContainer}>
          <img
            src={
              activity.title_img_wap
                ? `${domain}${activity.title_img_wap}`
                : activity.title_img
                ? `${domain}${activity.title_img}`
                : "https://dummyimage.com/1080x400/fff/000"
            }
            alt={activity.title}
            className={styles.image}
          />
        </div>

        {/* Promotion Info */}
        <div className={styles.infoSection}>
          <h2 className={styles.promotionTitle}>{activity.title}</h2>
          {activity.subtitle && (
            <p className={styles.promotionSubtitle}>{activity.subtitle}</p>
          )}

          {/* Dates */}
          <div className={styles.datesContainer}>
            {activity.start_at && (
              <div className={styles.dateItem}>
                <span className={styles.dateLabel}>Start:</span>
                <span className={styles.dateValue}>{activity.start_at}</span>
              </div>
            )}
            {activity.end_at && (
              <div className={styles.dateItem}>
                <span className={styles.dateLabel}>End:</span>
                <span className={styles.dateValue}>{activity.end_at}</span>
              </div>
            )}
            {!activity.start_at && !activity.end_at && (
              <div className={`${styles.dateItem} ${styles.longTermEvent}`}>
                <span className={styles.dateValue}>Ongoing Event</span>
              </div>
            )}
          </div>

          {/* Special Component: Check-in Calendar (Event ID 32) - Under date section */}
          {activity.id === CHECKIN_EVENT_ID && (
            <CheckinCalendar />
          )}

          {/* Promotion Content (HTML) */}
          {activity.title_content && (
            <div className={styles.descriptionContainer}>
              <h3 className={styles.sectionTitle}>Promotion Details</h3>
              <div
                className={styles.richContent}
                dangerouslySetInnerHTML={{ __html: activity.title_content }}
              />
            </div>
          )}

          {/* Additional Content */}
          {activity.content && (
            <div className={styles.descriptionContainer}>
              <h3 className={styles.sectionTitle}>Additional Information</h3>
              <div
                className={styles.richContent}
                dangerouslySetInnerHTML={{ __html: activity.content }}
              />
            </div>
          )}

          {/* Rules */}
          {activity.rule_content && (
            <div className={styles.descriptionContainer}>
              <h3 className={styles.sectionTitle}>Rules & Terms</h3>
              <div
                className={styles.richContent}
                dangerouslySetInnerHTML={{ __html: activity.rule_content }}
              />
            </div>
          )}

          {/* Special Component: First Deposit Bonus (Event ID 29) */}
          {activity.id === FIRST_DEPOSIT_EVENT_ID && (
            <FirstDepositBonus />
          )}

          {/* Action Button - Hide for special events */}
          {activity.button && activity.id !== FIRST_DEPOSIT_EVENT_ID && activity.id !== CHECKIN_EVENT_ID && (
            <button className={styles.actionBtn}>
              {activity.button}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
