import { useTranslation } from 'react-i18next';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const languages = [
    { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
    };

    return (
        <Menu as="div" style={{ position: 'relative', display: 'inline-block' }}>
            <MenuButton
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.8rem 1.2rem',
                    background: 'transparent',
                    border: '1px solid #444',
                    borderRadius: '0.8rem',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                }}
            >
                <span style={{ fontSize: '1.8rem' }}>{currentLang.flag}</span>
                <span>{currentLang.name}</span>
                <ChevronDownIcon style={{ width: '1.6rem', height: '1.6rem' }} />
            </MenuButton>

            <MenuItems
                style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '16rem',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '0.8rem',
                    boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.5)',
                    padding: '0.5rem',
                    zIndex: 50,
                }}
            >
                {languages.map((lang) => (
                    <MenuItem key={lang.code}>
                        {({ active }) => (
                            <button
                                onClick={() => changeLanguage(lang.code)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem 1.2rem',
                                    background: active ? '#333' : 'transparent',
                                    color: i18n.language === lang.code ? '#d81e28' : '#fff',
                                    border: 'none',
                                    borderRadius: '0.6rem',
                                    cursor: 'pointer',
                                    fontSize: '1.4rem',
                                    fontWeight: i18n.language === lang.code ? '700' : '500',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <span style={{ fontSize: '1.8rem' }}>{lang.flag}</span>
                                <span>{lang.name}</span>
                                {i18n.language === lang.code && (
                                    <span style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>✓</span>
                                )}
                            </button>
                        )}
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
}
