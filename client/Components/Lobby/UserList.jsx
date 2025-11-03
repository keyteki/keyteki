import * as React from 'react';
import { Trans } from 'react-i18next';

import Avatar from '../Site/Avatar';

/**
 * @typedef UserSummary
 * @property {string} username The username of the user
 * @property {string} name The username of the user again for some reason
 * @property {string} role The role of the user
 * @property {string} avatar The user's avatar
 */

/**
 * @typedef UserListProps
 * @property {UserSummary[]} users
 */

/**
 *
 * @param {UserListProps} props
 */
const UserList = ({ users }) => {
    if (!users) {
        return (
            <div>
                <Trans>Userlist loading...</Trans>
            </div>
        );
    }

    const userList = users.map((user) => {
        return (
            <div className='text-left font-normal pt-1 pl-2.5 hover:bg-sky-500/20' key={user.name}>
                <Avatar imgPath={user.avatar} />
                <span>{user.name}</span>
            </div>
        );
    });

    return (
        <div className='text-center pt-1 pb-5 font-bold'>
            <Trans>Online Users</Trans>
            {userList}
        </div>
    );
};

UserList.displayName = 'UserList';

export default UserList;
