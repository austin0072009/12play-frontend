import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Download.module.css";

type Platform = "android" | "ios";

export default function Download() {
  const { t } = useTranslation();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("android");

  const handleDownload = () => {
    // In production, replace with actual download URL from backend
    const downloadUrl = selectedPlatform === "android" 
      ? "https://example.com/12play.apk" 
      : "https://example.com/12play-ios";
    
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className={styles.downloadPage}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t("download.title")}</h1>
          <p className={styles.heroSubtitle}>{t("download.subtitle")}</p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{t("download.feature1")}</span>
            </div>
            <div className={styles.feature}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{t("download.feature2")}</span>
            </div>
            <div className={styles.feature}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{t("download.feature3")}</span>
            </div>
            <div className={styles.feature}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{t("download.feature4")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Selection */}
      <div className={styles.platformSection}>
        <div className={styles.platformButtons}>
          <button
            className={`${styles.platformBtn} ${selectedPlatform === "android" ? styles.active : ""}`}
            onClick={() => setSelectedPlatform("android")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 15.341c-.736 0-1.332.593-1.332 1.324 0 .73.596 1.323 1.332 1.323.736 0 1.332-.593 1.332-1.323 0-.731-.596-1.324-1.332-1.324zm-11.046 0c-.736 0-1.332.593-1.332 1.324 0 .73.596 1.323 1.332 1.323.736 0 1.332-.593 1.332-1.323 0-.731-.596-1.324-1.332-1.324zm11.405-6.472l2.116-3.655c.154-.263.063-.603-.203-.754-.267-.152-.607-.062-.759.201l-2.137 3.689c-1.686-.862-3.564-1.35-5.566-1.35-2.002 0-3.88.488-5.566 1.35L3.63 5.661c-.152-.263-.492-.353-.759-.201-.266.151-.357.491-.203.754l2.116 3.655C2.144 11.583.601 14.392.601 17.598h22.798c0-3.206-1.543-6.015-4.183-7.729zM23.399 18.598H.601v1h22.798v-1z"/>
            </svg>
            <span>Android</span>
          </button>
          <button
            className={`${styles.platformBtn} ${selectedPlatform === "ios" ? styles.active : ""}`}
            onClick={() => setSelectedPlatform("ios")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span>iOS (PWA)</span>
          </button>
        </div>
      </div>

      {/* Installation Steps */}
      <div className={styles.stepsSection}>
        <h2 className={styles.sectionTitle}>{t("download.howToInstall")}</h2>
        
        <div className={styles.steps}>
          {/* Step 1 */}
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{t("download.step1Title")}</h3>
              <p className={styles.stepDescription}>
                {selectedPlatform === "android" 
                  ? t("download.step1DescAndroid")
                  : t("download.step1DescIOS")}
              </p>
              <button className={styles.downloadBtn} onClick={handleDownload}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
                <span>{t("download.downloadNow")}</span>
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{t("download.step2Title")}</h3>
              <p className={styles.stepDescription}>
                {selectedPlatform === "android" 
                  ? t("download.step2DescAndroid")
                  : t("download.step2DescIOS")}
              </p>
              {selectedPlatform === "android" && (
                <div className={styles.note}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                  </svg>
                  <span>{t("download.androidNote")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 3 */}
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{t("download.step3Title")}</h3>
              <p className={styles.stepDescription}>{t("download.step3Desc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Section (Optional) */}
      <div className={styles.qrSection}>
        <h3 className={styles.qrTitle}>{t("download.qrTitle")}</h3>
        <p className={styles.qrDescription}>{t("download.qrDescription")}</p>
        <div className={styles.qrCode}>
          {/* Placeholder for QR code - replace with actual QR code component/image */}
          <div className={styles.qrPlaceholder}>
            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <p className={styles.qrLabel}>{t("download.scanToDownload")}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" x2="12.01" y1="18" y2="18"></line>
          </svg>
          <h4>{t("download.infoCard1Title")}</h4>
          <p>{t("download.infoCard1Desc")}</p>
        </div>
        <div className={styles.infoCard}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <h4>{t("download.infoCard2Title")}</h4>
          <p>{t("download.infoCard2Desc")}</p>
        </div>
        <div className={styles.infoCard}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <h4>{t("download.infoCard3Title")}</h4>
          <p>{t("download.infoCard3Desc")}</p>
        </div>
      </div>
    </div>
  );
}
