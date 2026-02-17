import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Label } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import Avatar from '../Site/Avatar';

/**
 * @typedef ProfileMenuProps
 * @property {import('../../menus').MenuItem[]} menu
 * @property {boolean} [mobile]
 * @property {User} user
 */

/**
 * @param {ProfileMenuProps} props
 */
const ProfileMenu = ({ menu, mobile = false, user }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const htmlEl = document.documentElement;
        const syncTheme = () => {
            const dataTheme = htmlEl.getAttribute('data-theme');
            setTheme(dataTheme === 'light' ? 'light' : 'dark');
        };

        syncTheme();

        const observer = new MutationObserver(syncTheme);
        observer.observe(htmlEl, {
            attributes: true,
            attributeFilter: ['class', 'data-theme']
        });

        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        if (typeof window.setAppTheme === 'function') {
            window.setAppTheme(nextTheme);
            return;
        }

        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
        window.localStorage.setItem('keyteki-theme', nextTheme);
    };

    if (!user) {
        return null;
    }

    const triggerClass = mobile
        ? '!inline-flex !h-9 !w-full !items-center !justify-start !rounded-md !bg-transparent !px-3 !text-sm !font-medium !text-foreground transition hover:!bg-surface-secondary/55 hover:!text-foreground'
        : '!inline-flex !h-9 !min-w-0 !items-center !rounded-md !bg-transparent !px-4 !text-sm !font-medium !text-amber-600 dark:!text-amber-300 transition hover:!bg-surface-secondary/55 hover:!text-amber-700 dark:hover:!text-amber-200 lg:!h-12';

    return (
        <Dropdown onOpenChange={setIsOpen}>
            <Dropdown.Trigger>
                <span className={triggerClass}>
                    <span className='inline-flex h-full items-center gap-1.5 leading-none'>
                        <Avatar imgPath={user.avatar} />
                        <span className='inline-flex items-center leading-none'>
                            {user.username}
                        </span>
                        <FontAwesomeIcon
                            icon={isOpen ? faChevronUp : faChevronDown}
                            className='text-xs text-current/90'
                        />
                    </span>
                </span>
            </Dropdown.Trigger>
            <Dropdown.Popover className='min-w-[11rem] rounded-xl border border-border/70 bg-overlay/95 p-1 text-foreground'>
                <Dropdown.Menu
                    aria-label={t('Profile')}
                    onAction={(key) => {
                        if (String(key) === '__toggle-theme') {
                            toggleTheme();
                            return;
                        }

                        navigate(String(key));
                    }}
                >
                    <Dropdown.Item
                        className='rounded-md px-3 py-2 data-[hovered]:bg-surface-secondary/55 data-[focused]:bg-surface-secondary/55'
                        key='__toggle-theme'
                        id='__toggle-theme'
                        textValue={t(
                            theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
                        )}
                    >
                        <Label>
                            {t(
                                theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
                            )}
                        </Label>
                    </Dropdown.Item>
                    {menu.map((menuItem) =>
                        menuItem.path ? (
                            <Dropdown.Item
                                className='rounded-md px-3 py-2 data-[hovered]:bg-surface-secondary/55 data-[focused]:bg-surface-secondary/55'
                                key={menuItem.path}
                                id={menuItem.path}
                                textValue={t(menuItem.title)}
                            >
                                <Label>{t(menuItem.title)}</Label>
                            </Dropdown.Item>
                        ) : null
                    )}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
};

export default ProfileMenu;
