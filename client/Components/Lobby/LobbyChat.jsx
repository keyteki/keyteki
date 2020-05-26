import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';

import Avatar from '../Site/Avatar';

import './LobbyChat.scss';

class LobbyChat extends React.Component {
    constructor(props) {
        super(props);

        this.onScroll = this.onScroll.bind(this);

        this.state = {
            canScroll: true
        };
    }

    componentDidMount() {
        $(this.messages).scrollTop(999999);
    }

    componentDidUpdate() {
        if (this.state.canScroll) {
            $(this.messages).scrollTop(999999);
        }
    }

    onScroll() {
        let messages = this.messages;

        setTimeout(() => {
            if (messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                this.setState({ canScroll: true });
            } else {
                this.setState({ canScroll: false });
            }
        }, 500);
    }

    onRemoveMessageClick(messageId, event) {
        event.preventDefault();

        if (this.props.onRemoveMessageClick) {
            this.props.onRemoveMessageClick(messageId);
        }
    }

    getMessages() {
        const groupedMessages = {};
        let index = 0;
        const today = moment();
        const yesterday = moment().add(-1, 'days');
        let lastUser;
        let currentGroup = 0;

        for (let message of this.props.messages) {
            if (!message.user) {
                return undefined;
            }

            const formattedTime = moment(message.time).format('YYYYMMDDHHmm');
            if (lastUser && message.user && lastUser !== message.user.username) {
                currentGroup++;
            }

            const key = message.user.username + formattedTime + currentGroup;

            if (!groupedMessages[key]) {
                groupedMessages[key] = [];
            }

            groupedMessages[key].push(message);

            lastUser = message.user.username;
        }

        return Object.values(groupedMessages).map((messages) => {
            let timestamp;
            const firstMessage = messages[0];

            if (!firstMessage.user) {
                return undefined;
            }

            if (today.isSame(firstMessage.time, 'd')) {
                timestamp = moment(firstMessage.time).format('H:mm');
            } else if (yesterday.isSame(firstMessage.time, 'd')) {
                timestamp = 'yesterday ' + moment(firstMessage.time).format('H:mm');
            } else {
                timestamp = moment(firstMessage.time).format('MMM Do H:mm');
            }

            let i = 0;
            const renderedMessages = messages.map((message) => {
                if (!message.user) {
                    return undefined;
                }

                let messageText;

                if (message.deleted) {
                    if (this.props.isModerator) {
                        messageText = (
                            <React.Fragment>
                                <span className='message-deleted message-moderated'>
                                    {message.message}
                                </span>
                                <span className='message-deleted'>
                                    {' '}
                                    - (Message removed by {message.deletedBy})
                                </span>
                            </React.Fragment>
                        );
                    } else {
                        messageText = (
                            <span className='message-deleted'>Message deleted by a moderator</span>
                        );
                    }
                } else {
                    messageText = message.message;
                }

                return (
                    <div key={message.user.username + i++} className='lobby-message'>
                        {messageText}
                        {this.props.isModerator && (
                            <a
                                href='#'
                                className='btn no-padding btn-noimg'
                                onClick={this.onRemoveMessageClick.bind(this, message.id)}
                            >
                                <span className='chat-delete glyphicon glyphicon-remove' />
                            </a>
                        )}
                    </div>
                );
            });

            let userClass =
                'username' +
                (firstMessage.user.role ? ` ${firstMessage.user.role.toLowerCase()}-role` : '');

            return (
                <div key={timestamp + firstMessage.user.username + (index++).toString()}>
                    <Avatar username={firstMessage.user.username} float />
                    <span className={userClass}>{firstMessage.user.username}</span>
                    <span>{timestamp}</span>
                    {renderedMessages}
                </div>
            );
        });
    }

    render() {
        return (
            <div
                className='lobby-messages'
                ref={(m) => (this.messages = m)}
                onScroll={this.onScroll}
            >
                {this.getMessages()}
            </div>
        );
    }
}

LobbyChat.displayName = 'LobbyChat';
LobbyChat.propTypes = {
    isModerator: PropTypes.bool,
    messages: PropTypes.array,
    onRemoveMessageClick: PropTypes.func
};

export default LobbyChat;
