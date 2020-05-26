import * as React from 'react';
import { Trans } from 'react-i18next';

import Avatar from '../Site/Avatar';

import './UserList.scss';

/**
 * @typedef UserSummary
 * @property {string} username The username of the user
 * @property {string} name The username of the user again for some reason
 * @property {string} role The role of the user
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
            <div className='user-row' key={user.name}>
                <Avatar username={user.name} />
                <span>{user.name}</span>
            </div>
        );
    });

    return (
        <div className='userlist'>
            <Trans>Online Users</Trans>
            {userList}
        </div>
    );
};

UserList.displayName = 'UserList';

export default UserList;
