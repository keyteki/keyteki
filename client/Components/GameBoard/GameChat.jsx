import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Messages from './Messages';

import './GameChat.scss';

const GameChat = ({ messages, muted, onCardMouseOver, onCardMouseOut, onSendChat }) => {
    const [canScroll, setCanScroll] = useState(true);
    const [message, setMessage] = useState('');
    const messagePanelRef = useRef(null);

    useEffect(() => {
        if (canScroll && messagePanelRef.current) {
            $(messagePanelRef.current).scrollTop(999999);
        }
    }, [canScroll, messages]);

    const onScroll = useCallback(() => {
        const messagesPanel = messagePanelRef.current;
        if (!messagesPanel) return;

        setTimeout(() => {
            if (
                messagesPanel.scrollTop >=
                messagesPanel.scrollHeight - messagesPanel.offsetHeight - 20
            ) {
                setCanScroll(true);
            } else {
                setCanScroll(false);
            }
        }, 500);
    }, []);

    const onChange = useCallback((event) => {
        setMessage(event.target.value.substring(0, Math.min(512, event.target.value.length)));
    }, []);

    const sendMessage = useCallback(() => {
        if (message === '') {
            return;
        }

        onSendChat(message);
        setMessage('');
    }, [message, onSendChat]);

    const onKeyPress = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                sendMessage();
                event.preventDefault();
            }
        },
        [sendMessage]
    );

    const placeholder = muted ? 'Spectators cannot chat in this game' : 'Chat...';

    return (
        <div className='chat'>
            <div className='messages panel' ref={messagePanelRef} onScroll={onScroll}>
                <Messages
                    messages={messages}
                    onCardMouseOver={onCardMouseOver}
                    onCardMouseOut={onCardMouseOut}
                />
            </div>
            <form className='form chat-form'>
                <input
                    className='form-control'
                    placeholder={placeholder}
                    onKeyPress={onKeyPress}
                    onChange={onChange}
                    value={message}
                    disabled={muted}
                />
            </form>
        </div>
    );
};

GameChat.displayName = 'GameChat';
GameChat.propTypes = {
    messages: PropTypes.array,
    muted: PropTypes.bool,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    onSendChat: PropTypes.func
};

export default GameChat;
