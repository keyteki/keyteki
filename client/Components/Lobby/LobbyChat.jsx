import React, { useCallback, useEffect } from 'react';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { addToast, Avatar, Link } from '@heroui/react';
import { Constants } from '../../constants';
import ChatArea from '../Site/ChatArea';
import { useDispatch } from 'react-redux';
import { clearChatStatus, sendLobbyChat } from '../../redux/slices/lobbySlice';
import { useRemoveLobbyMessageMutation } from '../../redux/slices/apiSlice';
import { useTranslation } from 'react-i18next';

const LobbyChat = ({ isLoggedIn, messages, isModerator, lobbyError }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [removeMessage] = useRemoveLobbyMessageMutation();

    const onRemoveMessageClick = useCallback(
        async (messageId) => {
            try {
                await removeMessage(messageId).unwrap();
            } catch (err) {
                addToast({
                    color: 'danger',
                    description: t('Failed to remove message. Check console for details')
                });
            }
        },
        [removeMessage]
    );

    const checkChatError = useCallback(() => {
        if (lobbyError) {
            addToast({
                color: 'danger',
                description: t('New users are limited from chatting in the lobby, try again later')
            });

            setTimeout(() => {
                dispatch(clearChatStatus());
            }, 5000);
        }
    }, [lobbyError, dispatch]);

    useEffect(() => {
        checkChatError();
    }, [checkChatError, dispatch]);

    useEffect(() => {
        checkChatError();
    }, [checkChatError, lobbyError]);

    const getMessages = useCallback(() => {
        const groupedMessages = {};
        let index = 0;
        const today = moment();
        const yesterday = moment().add(-1, 'days');
        let lastUser;
        let currentGroup = 0;
        for (let message of messages) {
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
                timestamp = t('yesterday ') + moment(firstMessage.time).format('H:mm');
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
                    if (isModerator) {
                        messageText = (
                            <>
                                <span className='italic line-through'>{message.message}</span>
                                <span className='italic'>
                                    {t(' - (Message removed by {{deletedBy}})', {
                                        deletedBy: message.deletedBy
                                    })}
                                </span>
                            </>
                        );
                    } else {
                        messageText = (
                            <span className='italic'>Message deleted by a moderator</span>
                        );
                    }
                } else {
                    messageText = message.message;
                }

                return (
                    <div
                        key={message.user.username + i++}
                        className='break-words text-gray-300 text-sm leading-[1.15rem] flex gap-1'
                    >
                        <span>{messageText}</span>
                        {isModerator && !message.deleted && (
                            <Link
                                className='text-danger text-small'
                                onPress={() => onRemoveMessageClick(message._id)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </Link>
                        )}
                    </div>
                );
            });

            const userClass =
                'username font-bold' +
                (firstMessage.user.role
                    ? ` ${Constants.ColorClassByRole[firstMessage.user.role.toLowerCase()]}`
                    : '');

            return (
                <div
                    key={timestamp + firstMessage.user.username + (index++).toString()}
                    className='mb-2 flex'
                >
                    <div className='mr-2'>
                        <Avatar
                            src={`/img/avatar/${firstMessage.user.username}.png`}
                            showFallback
                        />
                    </div>
                    <div className='overflow-x-hidden'>
                        <div className='flex'>
                            <span className={userClass}>{firstMessage.user.username}</span>
                            <span className='ml-2 text-gray-300 text-small'>{timestamp}</span>
                        </div>
                        {renderedMessages}
                    </div>
                </div>
            );
        });
    }, [messages, isModerator, onRemoveMessageClick]);

    const noMessagesLabel = (
        <div className='bg-default-200 rounded-lg rounded-b-none p-2'>
            There are no messages at the moment
        </div>
    );

    const placeholder = isLoggedIn
        ? t('Enter a message...')
        : t('You must be logged in to send lobby chat messages');
    return (
        <ChatArea
            className='overflow-hidden rounded-b-xl'
            messageCount={messages.length}
            noMessagesLabel={noMessagesLabel}
            onSendMessage={(message) => dispatch(sendLobbyChat(message))}
            isInputDisabled={!isLoggedIn}
            placeholder={placeholder}
            maxInputLength={512}
        >
            {getMessages()}
        </ChatArea>
    );
};

LobbyChat.displayName = 'LobbyChat';

export default LobbyChat;
