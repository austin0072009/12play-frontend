import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Promotions.module.css";
import { fetchActivityData } from "../services/api";
import { useAppStore } from "../store/app";

interface Activity {
  id: number;
  title: string;
  flag: string;
  title_img_wap?: string;
  type?: number;
  updated_at?: number;
  [key: string]: any;
}

export default function Promotions() {
  const navigate = useNavigate();
  const appStore = useAppStore();
  const domain = appStore.data?.domain || "";
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch promotions/activities from API
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const res = await fetchActivityData();
        if (res?.data?.list) {
          console.log("Fetched activities:", res.data.list);
          setActivities(res.data.list);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const handleActivityClick = (id: number) => {
    navigate(`/promotion/${id}`);
  };

  return (
    <div className={styles.container}>
      <div style={{ padding: "2rem", marginTop: "1rem", marginBottom: "20rem" }}>
        {loading ? (
          <div className={styles.loading}>Loading promotions...</div>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={styles.promotionDiv}
              onClick={() => handleActivityClick(activity.id)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.promoImage}>
                <img
                  src={
                    activity.title_img_wap
                      ? `${domain}${activity.title_img_wap}`
                      : "https://dummyimage.com/1080x278/fff/000"
                  }
                  alt={activity.title}
                />
              </div>
              <div className={styles.cardBody}>
                <p className={styles.title}>{activity.title}</p>
                <p className={styles.subtitle}>{activity.flag}</p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noData}>No promotions available</div>
        )}
      </div>
    </div>
  );
}
