import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { NavDropdown } from 'react-bootstrap';

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
    },
    {
        name: 'Tiếng Việt',
        value: 'vi'
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
        <NavDropdown
            align='end'
            className='d-flex align-items-center'
            id='nav-Lang'
            onSelect={(lang) => {
                i18n.changeLanguage(lang);
            }}
            title={i18n.language}
        >
            {languages.map((lang) => (
                <NavDropdown.Item
                    className='navbar-item interactable dropdown-child'
                    key={lang.value}
                    eventKey={lang.value}
                >
                    {lang.name}
                </NavDropdown.Item>
            ))}
        </NavDropdown>
    );
};

export default LanguageSelector;
