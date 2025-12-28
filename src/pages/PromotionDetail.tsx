import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PromotionDetail.module.css";
import { fetchActivityDetail } from "../services/api";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

interface ActivityDetail {
  id: number;
  title: string;
  image?: string;
  content?: string;
  description?: string;
  subtitle?: string;
  start_time?: string;
  end_time?: string;
  category?: string;
  [key: string]: any;
}

export default function PromotionDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
            src={activity.image || "https://dummyimage.com/1080x400/fff/000"}
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
            {activity.start_time && (
              <div className={styles.dateItem}>
                <span className={styles.dateLabel}>Start:</span>
                <span className={styles.dateValue}>{activity.start_time}</span>
              </div>
            )}
            {activity.end_time && (
              <div className={styles.dateItem}>
                <span className={styles.dateLabel}>End:</span>
                <span className={styles.dateValue}>{activity.end_time}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className={styles.descriptionContainer}>
            <h3 className={styles.sectionTitle}>Details</h3>
            <div className={styles.description}>
              {activity.description || activity.content || (
                <p>No description available</p>
              )}
            </div>
          </div>

          {/* Rich Content (if HTML content exists) */}
          {activity.content && (
            <div className={styles.richContentContainer}>
              <div
                className={styles.richContent}
                dangerouslySetInnerHTML={{ __html: activity.content }}
              />
            </div>
          )}

          {/* Action Button */}
          <button className={styles.actionBtn}>
            Participate Now
          </button>
        </div>
      </div>
    </div>
  );
}
