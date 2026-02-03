import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Messages from './Messages';

import './GameChat.scss';

const GameChat = (props) => {
    const messagePanel = useRef(null);
    const [canScroll, setCanScroll] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (canScroll && messagePanel.current) {
            $(messagePanel.current).scrollTop(999999);
        }
    }, [canScroll, props.messages]);

    const onScroll = useCallback(() => {
        const messages = messagePanel.current;
        if (!messages) {
            return;
        }

        setTimeout(() => {
            if (messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                setCanScroll(true);
            } else {
                setCanScroll(false);
            }
        }, 500);
    }, []);

    const onKeyPress = useCallback(
        (event) => {
            if (event.key !== 'Enter') {
                return;
            }

            if (message === '') {
                return;
            }

            props.onSendChat(message);
            setMessage('');
            event.preventDefault();
        },
        [message, props]
    );

    const placeholder = props.muted ? 'Spectators cannot chat in this game' : 'Chat...';

    return (
        <div className='chat'>
            <div className='messages panel' ref={messagePanel} onScroll={onScroll}>
                <Messages
                    messages={props.messages}
                    onCardMouseOver={props.onCardMouseOver}
                    onCardMouseOut={props.onCardMouseOut}
                />
            </div>
            <form className='form chat-form'>
                <input
                    className='form-control'
                    placeholder={placeholder}
                    onKeyPress={onKeyPress}
                    onChange={(event) =>
                        setMessage(
                            event.target.value.substring(
                                0,
                                Math.min(512, event.target.value.length)
                            )
                        )
                    }
                    value={message}
                    disabled={props.muted}
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
