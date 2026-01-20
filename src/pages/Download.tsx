import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import styles from "./Download.module.css";
import ios1 from "../assets/ios1.jpg";
import ios2 from "../assets/ios2.jpg";
import ios3 from "../assets/ios3.jpg";
import ios4 from "../assets/ios4.jpg";
import ios5 from "../assets/ios5.jpg";

type Platform = "android" | "ios";
type DeviceType = "android" | "ios" | "desktop";

function detectDevice(): DeviceType {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

export default function Download() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [deviceType] = useState<DeviceType>(detectDevice);

  // Get platform from URL params or detect from device
  const platformParam = searchParams.get("platform")?.toLowerCase();
  const initialPlatform: Platform =
    platformParam === "ios" ? "ios" :
    platformParam === "android" ? "android" :
    deviceType === "ios" ? "ios" : "android";

  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(initialPlatform);

  // Update URL when platform changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("platform", selectedPlatform.toUpperCase());
    window.history.replaceState({}, "", url.toString());
  }, [selectedPlatform]);

  const handleDownload = () => {
    // Replace with actual download URL from backend
    // Serve APK from public/ via Vite base URL so it works under any deploy base path
    const downloadUrl = `${import.meta.env.BASE_URL}redcow2.apk`;
    window.open(downloadUrl, "_blank");
  };

  const iosSteps = [
    { image: ios1, caption: t("download.ios.step1") },
    { image: ios2, caption: t("download.ios.step2") },
    { image: ios3, caption: t("download.ios.step3") },
    { image: ios4, caption: t("download.ios.step4") },
    { image: ios5, caption: t("download.ios.step5") },
  ];

  return (
    <div className={styles.downloadPage}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t("download.appTitle")}</h1>
        <p className={styles.subtitle}>{t("download.appSubtitle")}</p>
      </div>

      {/* Platform Tabs */}
      <div className={styles.platformTabs}>
        <button
          className={`${styles.tabBtn} ${selectedPlatform === "android" ? styles.active : ""}`}
          onClick={() => setSelectedPlatform("android")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.tabIcon}>
            <path d="M17.523 15.341c-.736 0-1.332.593-1.332 1.324 0 .73.596 1.323 1.332 1.323.736 0 1.332-.593 1.332-1.323 0-.731-.596-1.324-1.332-1.324zm-11.046 0c-.736 0-1.332.593-1.332 1.324 0 .73.596 1.323 1.332 1.323.736 0 1.332-.593 1.332-1.323 0-.731-.596-1.324-1.332-1.324zm11.405-6.472l2.116-3.655c.154-.263.063-.603-.203-.754-.267-.152-.607-.062-.759.201l-2.137 3.689c-1.686-.862-3.564-1.35-5.566-1.35-2.002 0-3.88.488-5.566 1.35L3.63 5.661c-.152-.263-.492-.353-.759-.201-.266.151-.357.491-.203.754l2.116 3.655C2.144 11.583.601 14.392.601 17.598h22.798c0-3.206-1.543-6.015-4.183-7.729z"/>
          </svg>
          <span>Android</span>
        </button>
        <button
          className={`${styles.tabBtn} ${selectedPlatform === "ios" ? styles.active : ""}`}
          onClick={() => setSelectedPlatform("ios")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.tabIcon}>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <span>iOS</span>
        </button>
      </div>

      {/* Android Content */}
      {selectedPlatform === "android" && (
        <div className={styles.contentSection}>
          {/* QR Code - Show on desktop */}
          {deviceType === "desktop" && (
            <div className={styles.qrSection}>
              <div className={styles.qrCard}>
                <div className={styles.qrCode}>
                  {/* Replace with actual QR code image */}
                  <svg viewBox="0 0 100 100" className={styles.qrPlaceholder}>
                    <rect x="10" y="10" width="25" height="25" fill="currentColor"/>
                    <rect x="65" y="10" width="25" height="25" fill="currentColor"/>
                    <rect x="10" y="65" width="25" height="25" fill="currentColor"/>
                    <rect x="40" y="40" width="20" height="20" fill="currentColor"/>
                    <rect x="65" y="65" width="25" height="25" fill="currentColor"/>
                  </svg>
                </div>
                <p className={styles.qrLabel}>{t("download.scanQR")}</p>
              </div>
            </div>
          )}

          {/* Download Button - Show on mobile or as alternative */}
          <div className={styles.downloadSection}>
            {deviceType !== "desktop" && (
              <p className={styles.downloadHint}>{t("download.tapToDownload")}</p>
            )}
            <button className={styles.downloadBtn} onClick={handleDownload}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.downloadIcon}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" x2="12" y1="15" y2="3"/>
              </svg>
              <span>{t("download.downloadAPK")}</span>
            </button>
            {deviceType === "desktop" && (
              <p className={styles.orText}>{t("download.orClickDownload")}</p>
            )}
          </div>

          {/* Android Installation Steps */}
          <div className={styles.stepsSection}>
            <h2 className={styles.stepsTitle}>{t("download.howToInstall")}</h2>
            <div className={styles.stepsGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3>{t("download.android.step1Title")}</h3>
                  <p>{t("download.android.step1Desc")}</p>
                </div>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3>{t("download.android.step2Title")}</h3>
                  <p>{t("download.android.step2Desc")}</p>
                </div>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3>{t("download.android.step3Title")}</h3>
                  <p>{t("download.android.step3Desc")}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* iOS Content */}
      {selectedPlatform === "ios" && (
        <div className={styles.contentSection}>
          <div className={styles.iosHeader}>
            <div className={styles.pwaIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.safariIcon}>
                <circle cx="12" cy="12" r="10"/>
                <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>
              </svg>
            </div>
            <p className={styles.iosHint}>{t("download.ios.hint")}</p>
          </div>

          {/* iOS Installation Steps with Images */}
          <div className={styles.stepsSection}>
            <h2 className={styles.stepsTitle}>{t("download.howToInstall")}</h2>
            <div className={styles.iosSteps}>
              {iosSteps.map((step, index) => (
                <div key={index} className={styles.iosStepCard}>
                  <div className={styles.iosStepNumber}>{index + 1}</div>
                  <div className={styles.iosImageWrapper}>
                    <img src={step.image} alt={`Step ${index + 1}`} className={styles.iosStepImage} />
                  </div>
                  <p className={styles.iosStepCaption}>{step.caption}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Open in Safari Button */}
          {deviceType === "ios" && (
            <div className={styles.safariSection}>
              <button
                className={styles.safariBtn}
                onClick={() => window.location.reload()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.safariIcon}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>
                </svg>
                <span>{t("download.ios.openInSafari")}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* App Benefits */}
      <div className={styles.benefitsSection}>
        <div className={styles.benefitCard}>
          <div className={styles.benefitIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className={styles.benefitText}>{t("download.benefit1")}</span>
        </div>
        <div className={styles.benefitCard}>
          <div className={styles.benefitIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <span className={styles.benefitText}>{t("download.benefit2")}</span>
        </div>
        <div className={styles.benefitCard}>
          <div className={styles.benefitIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <span className={styles.benefitText}>{t("download.benefit3")}</span>
        </div>
      </div>
    </div>
  );
}
