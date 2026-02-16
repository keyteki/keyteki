import React, { useState } from 'react';
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

    if (!user) {
        return null;
    }

    const triggerClass = mobile
        ? '!inline-flex !h-9 !w-full !items-center !justify-start !rounded-md !bg-transparent !px-3 !text-sm !font-medium !text-foreground transition hover:!bg-accent/15 hover:!text-foreground'
        : '!inline-flex !h-9 !min-w-0 !items-center !rounded-md !bg-transparent !px-4 !text-sm !font-medium !text-link transition hover:!bg-accent/15 hover:!text-accent lg:!h-12';

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
                <Dropdown.Menu aria-label={t('Profile')} onAction={(key) => navigate(String(key))}>
                    {menu.map((menuItem) =>
                        menuItem.path ? (
                            <Dropdown.Item
                                className='rounded-md px-3 py-2 data-[hovered]:bg-accent/12 data-[focused]:bg-accent/12'
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
