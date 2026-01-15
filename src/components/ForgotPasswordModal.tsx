import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faViber, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { fetchInitData } from '../services/api';
import styles from './ForgotPasswordModal.module.css';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const { t } = useTranslation();
  const [viberLink, setViberLink] = useState('#');
  const [telegramLink, setTelegramLink] = useState('#');

  useEffect(() => {
    const loadContactLinks = async () => {
      try {
        const data = await fetchInitData();
        if (data?.sysconfig) {
          setViberLink(data.sysconfig.service_link || '#');
          setTelegramLink(data.sysconfig.service_link1 || '#');
        }
      } catch (error) {
        console.error('Failed to load contact links:', error);
      }
    };

    if (isOpen) {
      loadContactLinks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <XMarkIcon className={styles.closeIcon} />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>{t('forgotPassword.title')}</h2>
          <p className={styles.subtitle}>{t('forgotPassword.subtitle')}</p>
        </div>

        <div className={styles.contactGrid}>
          {/* Viber */}
          <a 
            href={viberLink} 
            className={styles.contactCard}
            onClick={onClose}
          >
            <div className={styles.iconWrapper}>
              <FontAwesomeIcon icon={faViber} className={styles.icon} />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{t('contact.viber')}</h3>
              <p className={styles.cardDesc}>{t('contact.viberDesc')}</p>
            </div>
          </a>

          {/* Telegram */}
          <a 
            href={telegramLink} 
            className={styles.contactCard}
            onClick={onClose}
          >
            <div className={styles.iconWrapper}>
              <FontAwesomeIcon icon={faTelegram} className={styles.icon} />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{t('contact.telegram')}</h3>
              <p className={styles.cardDesc}>{t('contact.telegramDesc')}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
