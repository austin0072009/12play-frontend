import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Sidebar.module.css';

// Import flag images
import flagMy from '../assets/icons/flag-my.png';
import flagEn from '../assets/icons/flag-en.png';
import flagZh from '../assets/icons/flag-zh.png';

const languages = [
    { code: 'my', name: 'မြန်မာ', flag: flagMy },
    { code: 'en', name: 'English', flag: flagEn },
    { code: 'zh', name: '中文', flag: flagZh },
];

// Language/Globe icon matching sidebar nav item icons
const LanguageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navItemRightIcon}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" x2="22" y1="12" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

export default function LanguageSwitcher() {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Main button styled like nav item */}
            <div
                className={styles.navItem}
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: 'pointer' }}
            >
                <div className={styles.navItemContainer}>
                    <div className={styles.navItemLeft}>
                        <LanguageIcon />
                        <span className={styles.navLabel}>{t('sidebar.language') || 'Language'}</span>
                    </div>
                    <div className={styles.navItemRight} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img
                            src={currentLang.flag}
                            alt={currentLang.code}
                            style={{ width: '2.4rem', height: '1.6rem', objectFit: 'cover', borderRadius: '0.3rem' }}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                color: 'rgba(255,255,255,0.3)',
                                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                            }}
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div style={{
                    marginTop: '0.8rem',
                    background: '#2a2a2a',
                    border: '1px solid rgba(203, 0, 0, 0.2)',
                    borderRadius: '1.2rem',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                }}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.2rem',
                                padding: '1.4rem 1.8rem',
                                background: i18n.language === lang.code
                                    ? 'linear-gradient(135deg, rgba(203, 0, 0, 0.15) 0%, rgba(203, 0, 0, 0.05) 100%)'
                                    : 'transparent',
                                color: i18n.language === lang.code ? '#cb0000' : '#fff',
                                border: 'none',
                                borderBottom: lang.code !== languages[languages.length - 1].code ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                fontWeight: i18n.language === lang.code ? '600' : '500',
                                textAlign: 'left',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                if (i18n.language !== lang.code) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (i18n.language !== lang.code) {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <img
                                src={lang.flag}
                                alt={lang.code}
                                style={{ width: '2.4rem', height: '1.6rem', objectFit: 'cover', borderRadius: '0.3rem' }}
                            />
                            <span style={{ flex: 1 }}>{lang.name}</span>
                            {i18n.language === lang.code && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
