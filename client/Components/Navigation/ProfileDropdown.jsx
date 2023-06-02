import React from 'react';

import Avatar from '../Site/Avatar';
import NavbarItem from './NavbarItem';

/**
 * @typedef ProfileMenuProps
 * @property {import('./Navigation').MenuItem[]} menu
 * @property {User} user
 */

/**
 * @param {ProfileMenuProps} props
 */
const ProfileMenu = ({ menu, user }) => {
    if (!user) {
        return null;
    }

    const title = (
        <span>
            <Avatar imgPath={user.avatar} />
            {user.username}
        </span>
    );

    return <NavbarItem title={title} childLinks={menu} />;
};

export default ProfileMenu;
