import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faViber, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { fetchInitData } from '../services/api';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
  viberLink?: string;
  telegramLink?: string;
  liveChatLink?: string;
}

export default function ContactSection({ 
  viberLink: propViberLink, 
  telegramLink: propTelegramLink, 
  // liveChatLink: propLiveChatLink
}: ContactSectionProps) {
  const { t } = useTranslation();
  const [viberLink, setViberLink] = useState(propViberLink || '#');
  const [telegramLink, setTelegramLink] = useState(propTelegramLink || '#');
  // const [liveChatLink, setLiveChatLink] = useState(propLiveChatLink || '#');

  useEffect(() => {
    const loadContactLinks = async () => {
      try {
        const data = await fetchInitData();
        if (data?.sysconfig) {
          setViberLink(data.sysconfig.service_link || '#');
          setTelegramLink(data.sysconfig.service_link1 || '#');
          // Use channel_link for live chat if available
          // setLiveChatLink(data.sysconfig.channel_link || '#');
        }
      } catch (error) {
        console.error('Failed to load contact links:', error);
      }
    };

    loadContactLinks();
  }, []);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('contact.title')}</h2>
        <p className={styles.subtitle}>{t('contact.subtitle')}</p>
      </div>

      <div className={styles.contactGrid}>
        {/* Viber Section */}
        <a href={viberLink} className={styles.contactCard}>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={faViber} className={styles.icon} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{t('contact.viber')}</h3>
            <p className={styles.cardStatus}>{t('contact.available')}</p>
            <p className={styles.cardDesc}>{t('contact.viberDesc')}</p>
          </div>
        </a>

        {/* Telegram Section */}
        <a href={telegramLink} className={styles.contactCard}>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={faTelegram} className={styles.icon} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{t('contact.telegram')}</h3>
            <p className={styles.cardStatus}>{t('contact.available')}</p>
            <p className={styles.cardDesc}>{t('contact.telegramDesc')}</p>
          </div>
        </a>

        {/* Live Chat Section */}
        {/* <a href={liveChatLink} className={styles.contactCard}>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={faHeadset} className={styles.icon} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{t('contact.liveChat')}</h3>
            <p className={styles.cardStatus}>{t('contact.available')}</p>
            <p className={styles.cardDesc}>{t('contact.liveChatDesc')}</p>
          </div>
        </a> */}
      </div>
    </div>
  );
}
