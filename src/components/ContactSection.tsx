import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faViber, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
  viberLink?: string;
  telegramLink?: string;
  liveChatLink?: string;
}

export default function ContactSection({ 
  viberLink = '#', 
  telegramLink = '#', 
  liveChatLink = '#' 
}: ContactSectionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>24/7 Contact Service</h2>
        <p className={styles.subtitle}>We're here to help anytime, anywhere</p>
      </div>

      <div className={styles.contactGrid}>
        {/* Viber Section */}
        <a href={viberLink} className={styles.contactCard}>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={faViber} className={styles.icon} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Viber</h3>
            <p className={styles.cardStatus}>24/7 Available</p>
            <p className={styles.cardDesc}>Quick response on Viber</p>
          </div>
        </a>

        {/* Telegram Section */}
        <a href={telegramLink} className={styles.contactCard}>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={faTelegram} className={styles.icon} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Telegram</h3>
            <p className={styles.cardStatus}>24/7 Available</p>
            <p className={styles.cardDesc}>Instant messaging support</p>
          </div>
        </a>

        {/* Live Chat Section */}
        <a href={liveChatLink} className={styles.contactCard}>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={faHeadset} className={styles.icon} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Live Chat</h3>
            <p className={styles.cardStatus}>24/7 Available</p>
            <p className={styles.cardDesc}>Chat directly with support</p>
          </div>
        </a>
      </div>
    </div>
  );
}
