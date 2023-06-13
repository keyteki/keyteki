import React from 'react';

import Avatar from '../Site/Avatar';
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
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

    const title = (
        <span>
            <Avatar imgPath={user.avatar} />
            {user.username}
        </span>
    );

    return (
        <NavDropdown id='nav-Profile' title={title} className='d-flex align-items-center'>
            {menu.map((menuItem) =>
                menuItem.path ? (
                    <Link key={menuItem.path} href={menuItem.path}>
                        <NavDropdown.Item
                            className='navbar-item interactable dropdown-child'
                            as={Link}
                            href={menuItem.path}
                        >
                            {t(menuItem.title)}
                        </NavDropdown.Item>
                    </Link>
                ) : null
            )}
        </NavDropdown>
    );
};

export default ProfileMenu;
