import { XMarkIcon } from "@heroicons/react/24/solid";
import styles from "./Lottery2DTimeSectionPopup.module.css";
import { useTranslation } from "react-i18next";

interface BetSession {
  issue: string;
  win_time: string;
  set: string;
  value: string;
  win_num: string;
  winState?: number;
}

interface Lottery2DTimeSectionPopupProps {
  sessions: BetSession[];
  onClose: () => void;
  onSelectSection: (issue: string) => void;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get tomorrow's date in YYYY-MM-DD format
 */
function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if current time is after 16:30
 */
function isAfter1630(): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours > 16 || (hours === 16 && minutes >= 30);
}

/**
 * Check if current time is after 12:00
 */
function isAfter1200(): boolean {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 12;
}

export default function Lottery2DTimeSectionPopup({
  sessions,
  onClose,
  onSelectSection,
}: Lottery2DTimeSectionPopupProps) {
  const { t } = useTranslation();
  const handleSelectSection = (issue: string) => {
    onSelectSection(issue);
    onClose();
  };

  const todayDate = getTodayDate();
  const tomorrowDate = getTomorrowDate();
  const after1630 = isAfter1630();
  const after1200 = isAfter1200();

  // Find today's and tomorrow's sessions
  const todaySession12 = sessions.find((s) => 
    s.win_time.startsWith(todayDate) && s.win_time.includes("12:00")
  );
  const todaySession1630 = sessions.find((s) => 
    s.win_time.startsWith(todayDate) && s.win_time.includes("16:30")
  );
  
  const tomorrowSession12 = sessions.find((s) => 
    s.win_time.startsWith(tomorrowDate) && s.win_time.includes("12:00")
  );
  const tomorrowSession1630 = sessions.find((s) => 
    s.win_time.startsWith(tomorrowDate) && s.win_time.includes("16:30")
  );

  // Determine which sessions to display
  let session12, session1630, is12Disabled, is1630Disabled;

  if (after1630) {
    // After 16:30: Show tomorrow's sessions if available, otherwise disable both
    if (tomorrowSession12 || tomorrowSession1630) {
      session12 = tomorrowSession12;
      session1630 = tomorrowSession1630;
      is12Disabled = false;
      is1630Disabled = false;
    } else {
      // No tomorrow sessions yet, show today's but disabled
      session12 = todaySession12;
      session1630 = todaySession1630;
      is12Disabled = true;
      is1630Disabled = true;
    }
  } else if (after1200) {
    // Between 12:00 and 16:30: Top disabled, bottom enabled
    session12 = todaySession12;
    session1630 = todaySession1630;
    is12Disabled = true;
    is1630Disabled = false;
  } else {
    // Before 12:00: Both enabled
    session12 = todaySession12;
    session1630 = todaySession1630;
    is12Disabled = false;
    is1630Disabled = false;
  }

  // Always show two sections with fallback data
  const staticSections = [
    {
      issue: session12?.issue || "N/A",
      win_time: session12?.win_time || `${todayDate} 12:00:00`,
      label: t("lottery2d.section12"),
      isDisabled: is12Disabled || !session12,
    },
    {
      issue: session1630?.issue || "N/A",
      win_time: session1630?.win_time || `${todayDate} 16:30:00`,
      label: t("lottery2d.section1630"),
      isDisabled: is1630Disabled || !session1630,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} />

      {/* Popup Modal */}
      <div className={styles.popup}>
        <div className={styles.header}>
          <div className={styles.leftSpace} />
          <h1 className={styles.title}>{t("lottery2d.selectSection")}</h1>
          <button className={styles.closeBtn} onClick={onClose}>
            <XMarkIcon />
          </button>
        </div>

        <div className={styles.content}>
          {staticSections.map((section, index) => (
            <button
              key={index}
              className={`${styles.sectionBtn} ${
                section.isDisabled ? styles.disabled : ""
              }`}
              disabled={section.isDisabled}
              onClick={() => handleSelectSection(section.issue)}
            >
              <div className={styles.sectionInfo}>
                <span className={styles.sectionTime}>{section.label}</span>
                <span className={styles.sectionDate}>{section.win_time}</span>
              </div>
              {section.isDisabled && (
                <span className={styles.expiredBadge}>{t("lottery2d.sectionClosed")}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
