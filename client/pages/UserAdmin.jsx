import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import Form from '../Components/Form/Form';
import Checkbox from '../Components/Form/Checkbox';
import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';

import * as actions from '../redux/actions';
import { Col } from 'react-bootstrap';

class UserAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.defaultPermissions = {
            canEditNews: false,
            canManageUsers: false,
            canManagePermissions: false,
            canManageGames: false,
            canManageNodes: false,
            canModerateChat: false,
            canVerifyDecks: false,
            canManageBanlist: false,
            canManageMotd: false,
            canManageTournaments: false,
            isAdmin: false,
            isContributor: false,
            isSupporter: false,
            isWinner: false,
            isPreviousWinner: false
        };

        this.state = {
            permissions: this.props.currentUser
                ? this.props.currentUser.permissions || this.defaultPermissions
                : this.defaultPermissions,
            disabled: this.props.currentUser ? this.props.currentUser.disabled : false,
            verified: this.props.currentUser ? this.props.currentUser.verified : false,
            username: ''
        };

        this.permissions = [
            { name: 'canEditNews', label: 'News Editor' },
            { name: 'canManageUsers', label: 'User Manager' },
            { name: 'canManagePermissions', label: 'Permissions Manager' },
            { name: 'canManageGames', label: 'Games Manager' },
            { name: 'canManageNodes', label: 'Node Manager' },
            { name: 'canModerateChat', label: 'Chat Moderator' },
            { name: 'canVerifyDecks', label: 'Deck Verifier' },
            { name: 'canManageBanlist', label: 'Banlist Manager' },
            { name: 'canManageMotd', label: 'Motd Manager' },
            { name: 'canManageTournaments', label: 'Tournaments Manager' },
            { name: 'isAdmin', label: 'Site Admin' },
            { name: 'isContributor', label: 'Contributor' },
            { name: 'isSupporter', label: 'Supporter' },
            { name: 'isWinner', label: 'Tournament Winner' },
            { name: 'isPreviousWinner', label: 'Previous Tournament Winner' }
        ];

        this.onDisabledChanged = this.onDisabledChanged.bind(this);
        this.onVerifiedChanged = this.onVerifiedChanged.bind(this);
        this.onVerifyClick = this.onVerifyClick.bind(this);
        this.onVerifyAllClick = this.onVerifyAllClick.bind(this);
        this.onFindClick = this.onFindClick.bind(this);
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            permissions: props.currentUser
                ? props.currentUser.permissions || this.defaultPermissions
                : this.defaultPermissions,
            disabled: props.currentUser ? props.currentUser.disabled : false,
            verified: props.currentUser ? props.currentUser.verified : false
        });

        if (props.userSaved) {
            setTimeout(() => {
                props.clearUserStatus();
            }, 5000);
            this.setState({ successMessage: 'User saved successfully.' });
        } else if (props.deckVerified) {
            props.currentUser.invalidDecks = props.currentUser.invalidDecks.filter(
                (d) => d.id !== props.deckVerified
            );

            setTimeout(() => {
                props.clearUserStatus();
                this.setState({ successMessage: 'User saved successfully.' });
            }, 5000);
        } else {
            this.setState({ successMessage: undefined });
        }
    }

    onUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    onFindClick(state) {
        this.props.findUser(state.username);
    }

    onSaveClick(event) {
        event.preventDefault();

        this.props.currentUser.permissions = this.state.permissions;
        this.props.currentUser.disabled = this.state.disabled;
        this.props.currentUser.verified = this.state.verified;

        this.props.saveUser(this.props.currentUser);
    }

    onClearClick(event) {
        event.preventDefault();

        this.props.clearUserSessions(this.props.currentUser.username);
    }

    onVerifyClick(event, deckId) {
        event.preventDefault();

        this.props.verifyDeck(deckId);
    }

    onVerifyAllClick(event) {
        event.preventDefault();

        this.props.verifyAllDecks(this.props.currentUser.username);
    }

    onPermissionToggle(field, event) {
        var newState = {};
        newState.permissions = this.state.permissions;

        newState.permissions[field] = event.target.checked;
        this.setState(newState);
    }

    onDisabledChanged(event) {
        this.setState({ disabled: event.target.checked });
    }

    onVerifiedChanged(event) {
        this.setState({ verified: event.target.checked });
    }

    showDeckVerification() {
        return (
            this.props.user &&
            this.props.user.permissions.canVerifyDecks &&
            this.props.currentUser.invalidDecks &&
            this.props.currentUser.invalidDecks.length > 0
        );
    }

    onLinkedUserClick(name) {
        this.setState({ username: name });

        this.props.findUser(name);
    }

    render() {
        let renderedUser = null;

        if (this.props.currentUser) {
            let permissions = this.permissions.map((permission) => {
                return (
                    <Checkbox
                        key={permission.name}
                        name={'permissions.' + permission.name}
                        label={permission.label}
                        fieldClass='col-xs-4'
                        type='checkbox'
                        onChange={this.onPermissionToggle.bind(this, permission.name)}
                        checked={this.state.permissions[permission.name]}
                    />
                );
            });

            renderedUser = (
                <div>
                    <form className='form'>
                        <Panel title={`${this.props.currentUser.username} - User details`}>
                            <dl className='dl-horizontal'>
                                <dt>Username:</dt>
                                <dd>{this.props.currentUser.username}</dd>
                                <dt>Email:</dt>
                                <dd>{this.props.currentUser.email}</dd>
                                <dt>Registered:</dt>
                                <dd>
                                    {moment(this.props.currentUser.registered).format(
                                        'YYYY-MM-DD HH:MM'
                                    )}
                                </dd>
                            </dl>

                            <Checkbox
                                name={'disabled'}
                                label='Disabled'
                                fieldClass='col-xs-4'
                                type='checkbox'
                                onChange={this.onDisabledChanged}
                                checked={this.state.disabled}
                            />
                            <Checkbox
                                name={'verified'}
                                label='Verified'
                                fieldClass='col-xs-4'
                                type='checkbox'
                                onChange={this.onVerifiedChanged}
                                checked={this.state.verified}
                            />
                        </Panel>
                        {this.props.currentUser && this.props.currentUser.linkedAccounts && (
                            <Panel title='Possibly linked accounts'>
                                <ul className='list'>
                                    {this.props.currentUser.linkedAccounts.map((name) => {
                                        return (
                                            <li key={name}>
                                                <a
                                                    href='javascript:void(0)'
                                                    onClick={() => this.onLinkedUserClick(name)}
                                                >
                                                    {name}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Panel>
                        )}
                        {this.props.currentUser && this.props.currentUser.tokens && (
                            <Panel title='Sessions'>
                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th>IP Address</th>
                                            <th>Last Used</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.currentUser.tokens.map((token) => {
                                            return (
                                                <tr key={token.ip}>
                                                    <td>{token.ip}</td>
                                                    <td>
                                                        {moment(token.lastUsed).format(
                                                            'YYYY-MM-DD HH:MM'
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </Panel>
                        )}
                        {this.props.user && this.props.user.permissions.canManagePermissions ? (
                            <Panel title='Permissions'>
                                <div>{permissions}</div>
                            </Panel>
                        ) : null}

                        {this.showDeckVerification() && (
                            <div>
                                <Panel title='Unverified Decks'>
                                    <table className='table table-striped'>
                                        <thead>
                                            <tr>
                                                <th>Uuid</th>
                                                <th>Deck Name</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.props.currentUser.invalidDecks.map((deck) => {
                                                return (
                                                    <tr key={deck.uuid}>
                                                        <td>{deck.uuid}</td>
                                                        <td>{deck.name}</td>
                                                        <td>
                                                            <button
                                                                className='btn btn-default'
                                                                onClick={(event) =>
                                                                    this.onVerifyClick(
                                                                        event,
                                                                        deck.id
                                                                    )
                                                                }
                                                            >
                                                                Verify
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <button
                                        className='btn btn-primary'
                                        onClick={this.onVerifyAllClick}
                                    >
                                        Verify All
                                    </button>
                                </Panel>
                            </div>
                        )}
                        <button
                            type='button'
                            className='btn btn-primary col-xs-3'
                            onClick={this.onClearClick.bind(this)}
                        >
                            Clear sessions
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary col-xs-3'
                            onClick={this.onSaveClick.bind(this)}
                        >
                            Save{' '}
                            {this.props.apiSaveState && this.props.apiSaveState.loading && (
                                <span className='spinner button-spinner' />
                            )}
                        </button>
                    </form>
                </div>
            );
        }

        if (this.props.apiState && this.props.apiState.status === 404) {
            this.props.apiState.message = 'User was not found.';
        }

        return (
            <Col sm={{ span: 8, offset: 2 }}>
                <ApiStatus
                    apiState={this.props.apiState}
                    successMessage={this.state.successMessage}
                />
                <Panel title='User administration'>
                    <Form
                        name='userAdmin'
                        apiLoading={this.props.apiState && this.props.apiState.loading}
                        buttonClass='col-sm-offset-4 col-sm-3'
                        buttonText='Search'
                        onSubmit={this.onFindClick}
                    />
                </Panel>
                {renderedUser}
            </Col>
        );
    }
}

UserAdmin.displayName = 'UserAdmin';
UserAdmin.propTypes = {
    apiSaveState: PropTypes.object,
    apiState: PropTypes.object,
    clearUserSessions: PropTypes.func,
    clearUserStatus: PropTypes.func,
    currentUser: PropTypes.object,
    deckVerified: PropTypes.string,
    decksVerified: PropTypes.bool,
    findUser: PropTypes.func,
    loading: PropTypes.bool,
    saveUser: PropTypes.func,
    user: PropTypes.object,
    userSaved: PropTypes.bool,
    verifyAllDecks: PropTypes.func,
    verifyDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiSaveState: state.api.SAVE_USER,
        apiState: state.api.REQUEST_FINDUSER,
        currentUser: state.admin.currentUser,
        deckVerified: state.admin.deckVerified,
        decksVerified: state.admin.decksVerified,
        loading: state.api.loading,
        user: state.account.user,
        userSaved: state.admin.userSaved
    };
}

export default connect(mapStateToProps, actions)(UserAdmin);
