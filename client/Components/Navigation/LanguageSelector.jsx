import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const languages = [
    {
        name: 'English',
        value: 'en'
    },
    {
        name: 'Español',
        value: 'es'
    },
    {
        name: 'Deutsch',
        value: 'de'
    },
    {
        name: 'Português',
        value: 'pt'
    },
    {
        name: 'Italiano',
        value: 'it'
    },
    {
        name: 'Français',
        value: 'fr'
    },
    {
        name: 'Polski',
        value: 'pl'
    },
    {
        name: 'ไทย',
        value: 'th'
    },
    {
        name: '简体中文',
        value: 'zhhans'
    },
    {
        name: '繁體中文',
        value: 'zhhant'
    },
    {
        name: '한국어',
        value: 'ko'
    }
];

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        let currentLanguage = languages.find((l) => l.value === i18n.language);

        if (!currentLanguage) {
            i18n.changeLanguage('en');
        }
    }, [i18n]);

    return (
        <div className={'navbar-item navbar-link'}>
            {i18n.language}
            <div className={`navbar-dropdown navbar-dropdown-right link-${languages.length}`}>
                <div className={'navbar-dropdown-padding'} />
                {languages.map((lang) => (
                    <div key={lang.name}>
                        <a
                            className={'navbar-item navbar-link'}
                            key={lang.name}
                            onClick={(e) => {
                                e.preventDefault();
                                i18n.changeLanguage(lang.value);
                            }}
                        >
                            {lang.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelector;
