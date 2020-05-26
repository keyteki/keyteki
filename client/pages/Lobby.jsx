import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation, Trans } from 'react-i18next';
import { Col } from 'react-bootstrap';

import News from '../Components/News/News';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Typeahead from '../Components/Form/Typeahead';
import SideBar from '../Components/Lobby/SideBar';
import UserList from '../Components/Lobby/UserList';
import LobbyChat from '../Components/Lobby/LobbyChat';

import * as actions from '../redux/actions';

import './Lobby.scss';

class Lobby extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onRemoveMessageClick = this.onRemoveMessageClick.bind(this);

        this.state = {
            message: ''
        };
    }

    componentDidMount() {
        this.props.loadNews({ limit: 3 });

        this.checkChatError(this.props);
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        this.checkChatError(props);
    }

    checkChatError(props) {
        if (props.lobbyError) {
            toastr.error(
                'Error',
                'New users are limited from chatting in the lobby, try again later'
            );

            setTimeout(() => {
                this.props.clearChatStatus();
            }, 5000);
        }
    }

    sendMessage() {
        if (this.state.message === '') {
            return;
        }

        this.props.socket.emit('lobbychat', this.state.message);

        this.setState({ message: '' });
    }

    onKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();

            this.message.clear();

            event.preventDefault();
        }
    }

    onSendClick(event) {
        event.preventDefault();

        this.sendMessage();
    }

    onChange(value) {
        this.setState({ message: value });
    }

    onRemoveMessageClick(messageId) {
        this.props.removeLobbyMessage(messageId);
    }

    render() {
        let t = this.props.t;
        let isLoggedIn = !!this.props.user;
        let placeholder = isLoggedIn
            ? 'Enter a message...'
            : 'You must be logged in to send lobby chat messages';

        return (
            <div>
                <SideBar>
                    <UserList users={this.props.users} />
                </SideBar>
                <Col sm={{ span: 10, offset: 1 }}>
                    <div className='main-header' />
                </Col>
                {this.props.motd?.message && (
                    <Col sm={{ span: 10, offset: 1 }} className='banner'>
                        <AlertPanel type={'danger'} message={this.props.motd.message}></AlertPanel>
                    </Col>
                )}
                {this.props.bannerNotice ? (
                    <Col sm={{ span: 10, offset: 1 }} className='annoucement'>
                        <AlertPanel message={this.props.bannerNotice} type='error' />
                    </Col>
                ) : null}
                <Col sm={{ span: 10, offset: 1 }}>
                    <Panel title={t('Latest site news')}>
                        {this.props.loading ? (
                            <div>
                                <Trans>News loading...</Trans>
                            </div>
                        ) : null}
                        <News news={this.props.news} />
                    </Panel>
                </Col>
                <Col sm={{ span: 10, offset: 1 }} className='chat-container'>
                    <Panel
                        title={t('Lobby Chat ({{users}}) online', {
                            users: this.props.users.length
                        })}
                    >
                        <div>
                            <LobbyChat
                                messages={this.props.messages}
                                isModerator={this.props.user?.permissions?.canModerateChat}
                                onRemoveMessageClick={this.onRemoveMessageClick}
                            />
                        </div>
                    </Panel>
                    <form
                        className='form form-hozitontal chat-box-container'
                        onSubmit={(event) => this.onSendClick(event)}
                    >
                        <div className='form-group'>
                            <div className='chat-box'>
                                <Typeahead
                                    disabled={!isLoggedIn}
                                    ref={(m) => (this.message = m)}
                                    value={this.state.message}
                                    placeholder={t(placeholder)}
                                    labelKey={'name'}
                                    onKeyDown={this.onKeyPress}
                                    options={this.props.users}
                                    onInputChange={this.onChange}
                                    autoFocus
                                    dropup
                                    emptyLabel={''}
                                    minLength={2}
                                />
                            </div>
                        </div>
                    </form>
                </Col>
            </div>
        );
    }
}

Lobby.displayName = 'Lobby';
Lobby.propTypes = {
    bannerNotice: PropTypes.string,
    clearChatStatus: PropTypes.func,
    i18n: PropTypes.object,
    loadNews: PropTypes.func,
    loading: PropTypes.bool,
    lobbyError: PropTypes.string,
    messages: PropTypes.array,
    motd: PropTypes.object,
    news: PropTypes.array,
    removeLobbyMessage: PropTypes.func,
    socket: PropTypes.object,
    t: PropTypes.func,
    user: PropTypes.object,
    users: PropTypes.array
};

function mapStateToProps(state) {
    return {
        bannerNotice: state.lobby.notice,
        loading: state.api.loading,
        lobbyError: state.lobby.lobbyError,
        messages: state.lobby.messages,
        motd: state.lobby.motd,
        news: state.news.news,
        newsLoading: state.news.newsLoading,
        socket: state.lobby.socket,
        user: state.account.user,
        users: state.lobby.users
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Lobby));
