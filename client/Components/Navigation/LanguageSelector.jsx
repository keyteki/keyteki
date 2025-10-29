import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import Button from '../HeroUI/Button';

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
        <Dropdown placement='bottom-end'>
            <DropdownTrigger>
                <Button variant='light' className='bg-transparent text-foreground'>
                    {i18n.language}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label='Language selector'
                selectedKeys={[i18n.language]}
                selectionMode='single'
                onAction={(key) => i18n.changeLanguage(String(key))}
            >
                {languages.map((lang) => (
                    <DropdownItem key={lang.value} textValue={lang.name}>
                        <span className='navbar-item interactable dropdown-child'>{lang.name}</span>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};

export default LanguageSelector;
