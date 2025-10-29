import React from 'react';

import Avatar from '../Site/Avatar';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import Button from '../HeroUI/Button';
import Link from './Link';

/**
 * @typedef ProfileMenuProps
 * @property {import('./Navigation').MenuItem[]} menu
 * @property {User} user
 */

/**
 * @param {ProfileMenuProps} props
 */
const ProfileMenu = ({ menu, user }) => {
    const { t } = useTranslation();

    if (!user) {
        return null;
    }

    const trigger = (
        <Button variant='light' className='flex items-center gap-2 bg-transparent text-foreground'>
            <Avatar imgPath={user.avatar} />
            <span>{user.username}</span>
        </Button>
    );

    return (
        <Dropdown placement='bottom-end'>
            <DropdownTrigger>{trigger}</DropdownTrigger>
            <DropdownMenu aria-label='Profile Menu'>
                {menu.map((menuItem) =>
                    menuItem.path ? (
                        <DropdownItem key={menuItem.path} textValue={t(menuItem.title)}>
                            <Link
                                href={menuItem.path}
                                className='navbar-item interactable dropdown-child'
                            >
                                {t(menuItem.title)}
                            </Link>
                        </DropdownItem>
                    ) : null
                )}
            </DropdownMenu>
        </Dropdown>
    );
};

export default ProfileMenu;
