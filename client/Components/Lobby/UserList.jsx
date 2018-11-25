import * as React from 'react';
import PropTypes from 'prop-types';

import Avatar from '../Site/Avatar';

class UserList extends React.Component {
    render() {
        if(!this.props.users) {
            return <div>Userlist loading...</div>;
        }

        const userList = this.props.users.map(user => {
            return (
                <div className='user-row' key={ user.name }>
                    <Avatar username={ user.name } />
                    <span>{ user.name }</span>
                </div>
            );
        });

        return (<div className='userlist'>Online Users
            { userList }
        </div>);
    }
}

UserList.displayName = 'UserList';
UserList.propTypes = {
    users: PropTypes.array
};

export default UserList;
