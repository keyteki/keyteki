import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import Avatar from '../Site/Avatar';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const containsUserMention = (messageText, username) => {
    if (!messageText || !username) {
        return false;
    }

    const mentionRegex = new RegExp(
        `(^|[^A-Za-z0-9_-])@${escapeRegex(username)}(?![A-Za-z0-9_-])`,
        'i'
    );
    return mentionRegex.test(messageText);
};

const getRoleTextClass = (role) => {
    switch ((role || '').toLowerCase()) {
        case 'admin':
            return 'text-red-500';
        case 'contributor':
            return 'text-cyan-600 dark:text-cyan-400';
        case 'supporter':
            return 'text-emerald-600 dark:text-emerald-400';
        case 'winner':
            return 'text-amber-600 dark:text-amber-400';
        case 'previouswinner':
            return 'text-fuchsia-600 dark:text-fuchsia-400';
        default:
            return 'text-foreground';
    }
};

const LobbyChat = ({
    messages,
    isModerator,
    onRemoveMessageClick,
    className = '',
    highlightUsername
}) => {
    const messageRef = useRef();
    const messageContentRef = useRef();
    const resizeObserverRef = useRef();
    const shouldAutoFollowRef = useRef(true);
    const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);

    const isNearBottom = () => {
        if (!messageRef.current) {
            return true;
        }

        const messageList = messageRef.current;
        const distanceFromBottom =
            messageList.scrollHeight - messageList.scrollTop - messageList.clientHeight;

        return distanceFromBottom <= 80;
    };

    const syncPinnedState = (nextPinned) => {
        shouldAutoFollowRef.current = nextPinned;
        setIsPinnedToBottom((currentPinned) =>
            currentPinned === nextPinned ? currentPinned : nextPinned
        );
    };

    const scrollToBottom = (forcePin = false) => {
        if (!messageRef.current) {
            return;
        }

        const messageList = messageRef.current;
        messageList.scrollTop = messageList.scrollHeight - messageList.clientHeight;

        if (forcePin) {
            syncPinnedState(true);
        }
    };

    const scheduleScrollToBottom = (forcePin = false) => {
        // Wait for layout/paint so scrollHeight is accurate after message render.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scrollToBottom(forcePin);
                setTimeout(() => scrollToBottom(forcePin), 0);
            });
        });
    };

    useLayoutEffect(() => {
        if (!shouldAutoFollowRef.current && !isNearBottom()) {
            return;
        }

        scheduleScrollToBottom();
    }, [messages]);

    useEffect(() => {
        scheduleScrollToBottom(true);
    }, []);

    useEffect(() => {
        if (!messageContentRef.current) {
            return;
        }

        resizeObserverRef.current = new ResizeObserver(() => {
            if (shouldAutoFollowRef.current) {
                scheduleScrollToBottom(true);
            }
        });
        resizeObserverRef.current.observe(messageContentRef.current);

        return () => {
            resizeObserverRef.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!messageContentRef.current) {
            return;
        }

        const mutationObserver = new MutationObserver(() => {
            if (shouldAutoFollowRef.current) {
                scheduleScrollToBottom(true);
            }
        });

        mutationObserver.observe(messageContentRef.current, {
            childList: true,
            subtree: true,
            characterData: true
        });

        return () => {
            mutationObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const onWindowResize = () => {
            if (shouldAutoFollowRef.current) {
                scheduleScrollToBottom(true);
            }
        };
        const onVisibilityOrFocus = () => {
            if (document.visibilityState === 'visible' && shouldAutoFollowRef.current) {
                scheduleScrollToBottom(true);
            }
        };

        window.addEventListener('resize', onWindowResize);
        window.addEventListener('focus', onVisibilityOrFocus);
        document.addEventListener('visibilitychange', onVisibilityOrFocus);
        return () => {
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('focus', onVisibilityOrFocus);
            document.removeEventListener('visibilitychange', onVisibilityOrFocus);
        };
    }, []);

    const onScroll = () => {
        syncPinnedState(isNearBottom());
    };

    const getMessages = () => {
        const groupedMessages = {};
        const today = moment();
        const yesterday = moment().add(-1, 'days');
        let index = 0;
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
                timestamp = 'yesterday ' + moment(firstMessage.time).format('H:mm');
            } else {
                timestamp = moment(firstMessage.time).format('MMM Do H:mm');
            }

            let i = 0;
            const userWasMentioned = messages.some((message) =>
                containsUserMention(message?.message, highlightUsername)
            );
            const renderedMessages = messages.map((message) => {
                if (!message.user) {
                    return undefined;
                }

                let messageText;

                if (message.deleted) {
                    if (isModerator) {
                        messageText = (
                            <>
                                <span className='message-deleted message-moderated'>
                                    {message.message}
                                </span>
                                <span className='message-deleted'>
                                    {' '}
                                    - (Message removed by {message.deletedBy})
                                </span>
                            </>
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
                    <div
                        key={message.user.username + i++}
                        className='group/message flex w-full items-start justify-between gap-2'
                    >
                        <span className='break-words leading-5'>{messageText}</span>
                        {isModerator && !message.deleted ? (
                            <button
                                type='button'
                                className='shrink-0 px-1.5 text-red-500 !opacity-0 transition hover:text-red-400 group-hover/message:!opacity-100 focus-visible:!opacity-100'
                                onClick={() => onRemoveMessageClick(message.id)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        ) : null}
                    </div>
                );
            });

            const userClass = `username font-semibold ${getRoleTextClass(firstMessage.user.role)}`;

            return (
                <div
                    key={timestamp + firstMessage.user.username + (index++).toString()}
                    className={`mb-1 flex items-start gap-2 rounded-md border border-border/45 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:bg-surface-secondary/90 ${
                        userWasMentioned
                            ? 'bg-accent/16 ring-1 ring-accent/45'
                            : 'bg-surface-secondary/72'
                    }`}
                >
                    <div className='shrink-0 pt-0.5'>
                        <Avatar imgPath={firstMessage.user.avatar} />
                    </div>
                    <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2 leading-5'>
                            <span className={userClass}>{firstMessage.user.username}</span>
                            <span className='inline-flex items-center text-foreground/70'>
                                {timestamp}
                            </span>
                        </div>
                        <div>{renderedMessages}</div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className='relative min-h-0 flex-1'>
            <div
                className={`min-h-0 h-full overflow-y-auto px-1 pe-3 pt-2 [scrollbar-gutter:stable] text-[13px] [&_.message-deleted]:italic [&_.message-moderated]:line-through [&_.username]:me-1 ${className}`}
                ref={messageRef}
                onScroll={onScroll}
            >
                <div ref={messageContentRef}>{getMessages()}</div>
            </div>
            {!isPinnedToBottom ? (
                <button
                    type='button'
                    className='absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-border/80 bg-overlay/95 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-[var(--overlay-shadow)] transition hover:bg-accent/15'
                    onClick={() => scheduleScrollToBottom(true)}
                >
                    Jump to latest
                </button>
            ) : null}
        </div>
    );
};

LobbyChat.displayName = 'LobbyChat';

export default LobbyChat;
