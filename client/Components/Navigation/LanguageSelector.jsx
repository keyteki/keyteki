import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Label } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const languages = [
    {
        name: 'English',
        value: 'en'
    },
    {
        name: 'Espanol',
        value: 'es'
    },
    {
        name: 'Deutsch',
        value: 'de'
    },
    {
        name: 'Portugues',
        value: 'pt'
    },
    {
        name: 'Italiano',
        value: 'it'
    },
    {
        name: 'Francais',
        value: 'fr'
    },
    {
        name: 'Polski',
        value: 'pl'
    },
    {
        name: 'Thai',
        value: 'th'
    },
    {
        name: 'Chinese (Simplified)',
        value: 'zhhans'
    },
    {
        name: 'Chinese (Traditional)',
        value: 'zhhant'
    },
    {
        name: 'Korean',
        value: 'ko'
    },
    {
        name: 'Tieng Viet',
        value: 'vi'
    }
];

const LanguageSelector = ({ mobile = false }) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const currentLanguage = languages.find((language) => language.value === i18n.language);

        if (!currentLanguage) {
            i18n.changeLanguage('en');
        }
    }, [i18n]);

    const triggerClass = mobile
        ? '!inline-flex !h-9 !w-full !items-center !justify-start !rounded-md !bg-transparent !px-3 !text-sm !font-medium !text-foreground transition hover:!bg-accent/15 hover:!text-foreground'
        : '!inline-flex !h-9 !min-w-0 !items-center !rounded-md !bg-transparent !px-4 !text-sm !font-medium !text-link transition hover:!bg-accent/15 hover:!text-accent lg:!h-[50px]';

    return (
        <Dropdown onOpenChange={setIsOpen}>
            <Dropdown.Trigger>
                <span className={triggerClass}>
                    <span className='inline-flex h-full items-center gap-1.5 leading-none'>
                        <span className='inline-flex items-center leading-none'>
                            {String(i18n.language || 'en').toUpperCase()}
                        </span>
                        <FontAwesomeIcon
                            icon={isOpen ? faChevronUp : faChevronDown}
                            className='text-[10px] text-current/90'
                        />
                    </span>
                </span>
            </Dropdown.Trigger>
            <Dropdown.Popover className='min-w-[13rem] rounded-xl border border-border/70 bg-overlay/95 p-1 text-foreground'>
                <Dropdown.Menu
                    aria-label='Language selector'
                    onAction={(key) => i18n.changeLanguage(String(key))}
                >
                    {languages.map((language) => (
                        <Dropdown.Item
                            className='rounded-md px-3 py-2 data-[hovered]:bg-accent/12 data-[focused]:bg-accent/12'
                            key={language.value}
                            id={language.value}
                            textValue={language.name}
                        >
                            <Label>{language.name}</Label>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
};

export default LanguageSelector;
