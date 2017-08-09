import React from 'react';
import {connect} from 'react-redux';
import _ from 'underscore';

import AlertPanel from './SiteComponents/AlertPanel.jsx';
import Input from './FormComponents/Input.jsx';
import Checkbox from './FormComponents/Checkbox.jsx';

import * as actions from './actions';

class InnerUserAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.defaultPermissions = {
            canEditNews: false,
            canManageUsers: false
        };

        this.state = {
            permissions: this.props.currentUser ? (this.props.currentUser.permissions || this.defaultPermissions) : this.defaultPermissions,
            username: ''
        };

        this.permissions = [
            { name: 'canEditNews', label: 'News Editor' },
            { name: 'canManageUsers', label: 'User Manager' }
        ];
    }

    componentWillReceiveProps(props) {
        this.setState({ permissions: props.currentUser ? (props.currentUser.permissions || this.defaultPermissions) : this.defaultPermissions });
    }

    onUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    onFindClick(event) {
        event.preventDefault();

        this.props.findUser(this.state.username);
    }

    onSaveClick(event) {
        event.preventDefault();

        this.props.currentUser.permissions = this.state.permissions;

        this.props.saveUser(this.props.currentUser);
    }

    onPermissionToggle(field, event) {
        var newState = {};
        newState.permissions = this.state.permissions;

        newState.permissions[field] = event.target.checked;
        this.setState(newState);
    }

    render() {
        let content = null;
        let successPanel = null;

        if(this.props.userSaved) {
            setTimeout(() => {
                this.props.clearUserStatus();
            }, 5000);
            successPanel = (
                <AlertPanel message='User saved successfully' type={ 'success' } />
            );
        }

        let notFoundMessage = this.props.apiStatus === 404 ? <AlertPanel type='warning' message='No users found' /> : null;

        let renderedUser = null;

        if(this.props.currentUser) {
            let permissions = _.map(this.permissions, (permission) => {
                return (<Checkbox key={ permission.name } name={ 'permissions.' + permission.name } label={ permission.label } fieldClass='col-sm-offset-3 col-sm-4'
                    type='checkbox' onChange={ this.onPermissionToggle.bind(this, permission.name) } checked={ this.state.permissions[permission.name] } />);
            });

            renderedUser = (
                <div>
                    <h3>User details</h3>

                    <form className='form'>
                        <dl>
                            <dt>Username:</dt><dd>{ this.props.currentUser.username }</dd>
                            <dt>Email:</dt><dd>{ this.props.currentUser.email }</dd>
                            <dt>Registered:</dt><dd>{ this.props.currentUser.registered }</dd>
                        </dl>

                        <h4>Permissions</h4>
                        { permissions }
                        <button type='button' className='btn btn-primary' onClick={ this.onSaveClick.bind(this) }>Save</button>
                    </form>
                </div>
            );
        }

        if(this.props.loading) {
            content = <div>Searching for user...</div>;
        } else if(this.props.apiError && this.props.apiStatus !== 404) {
            content = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            content = (
                <div>
                    { notFoundMessage }
                    { successPanel }
                    <form className='form'>
                        <Input name='username' label={ 'Search for a user' } value={ this.state.username } onChange={ this.onUsernameChange.bind(this) } placeholder={ 'Enter username' } />
                        <button type='submit' className='btn btn-primary' onClick={ this.onFindClick.bind(this) }>Find</button>
                    </form>

                    { renderedUser }
                </div>);
        }

        return content;
    }
}

InnerUserAdmin.displayName = 'UserAdmin';
InnerUserAdmin.propTypes = {
    apiError: React.PropTypes.string,
    apiStatus: React.PropTypes.number,
    clearUserStatus: React.PropTypes.func,
    currentUser: React.PropTypes.object,
    findUser: React.PropTypes.func,
    loading: React.PropTypes.bool,
    saveUser: React.PropTypes.func,
    userSaved: React.PropTypes.bool
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        apiStatus: state.api.status,
        currentUser: state.admin.currentUser,
        loading: state.api.loading,
        userSaved: state.admin.userSaved
    };
}

const UserAdmin = connect(mapStateToProps, actions)(InnerUserAdmin);

export default UserAdmin;

