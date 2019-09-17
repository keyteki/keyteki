import * as React from 'react';
import PropTypes from 'prop-types';

import Avatar from '../Site/Avatar';

import { withTranslation, Trans } from 'react-i18next';

class UserList extends React.Component {
    render() {
        if(!this.props.users) {
            return <div><Trans>Userlist loading...</Trans></div>;
        }

        const userList = this.props.users.map(user => {
            return (
                <div className='user-row' key={ user.name }>
                    <Avatar username={ user.name } />
                    <span>{ user.name }</span>
                </div>
            );
        });

        return (<div className='userlist'><Trans>Online Users</Trans>
            { userList }
        </div>);
    }
}

UserList.displayName = 'UserList';
UserList.propTypes = {
    i18n: PropTypes.object,
    t: PropTypes.func,
    users: PropTypes.array
};

export default withTranslation()(UserList);
