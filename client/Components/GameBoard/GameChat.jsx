import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from '@heroui/react';

import Messages from './Messages';

const GameChat = (props) => {
    const messagePanel = useRef(null);
    const messageContentRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const shouldAutoFollowRef = useRef(true);
    const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);
    const [message, setMessage] = useState('');

    const isNearBottom = useCallback(() => {
        if (!messagePanel.current) {
            return true;
        }

        const messageList = messagePanel.current;
        const distanceFromBottom =
            messageList.scrollHeight - messageList.scrollTop - messageList.clientHeight;

        return distanceFromBottom <= 80;
    }, []);

    const syncPinnedState = useCallback((nextPinned) => {
        shouldAutoFollowRef.current = nextPinned;
        setIsPinnedToBottom((currentPinned) =>
            currentPinned === nextPinned ? currentPinned : nextPinned
        );
    }, []);

    const scrollToBottom = useCallback(
        (forcePin = false) => {
            if (!messagePanel.current) {
                return;
            }

            const messageList = messagePanel.current;
            messageList.scrollTop = messageList.scrollHeight - messageList.clientHeight;

            if (forcePin) {
                syncPinnedState(true);
            }
        },
        [syncPinnedState]
    );

    const scheduleScrollToBottom = useCallback(
        (forcePin = false) => {
            // Wait for layout/paint so scrollHeight is accurate after message render.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    scrollToBottom(forcePin);
                    setTimeout(() => scrollToBottom(forcePin), 0);
                });
            });
        },
        [scrollToBottom]
    );

    useLayoutEffect(() => {
        if (!shouldAutoFollowRef.current && !isNearBottom()) {
            return;
        }

        scheduleScrollToBottom();
    }, [props.messages, isNearBottom, scheduleScrollToBottom]);

    useEffect(() => {
        scheduleScrollToBottom(true);
    }, [scheduleScrollToBottom]);

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
    }, [scheduleScrollToBottom]);

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
    }, [scheduleScrollToBottom]);

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
    }, [scheduleScrollToBottom]);

    const onScroll = useCallback(() => {
        syncPinnedState(isNearBottom());
    }, [isNearBottom, syncPinnedState]);

    const onSubmit = useCallback(
        (event) => {
            event.preventDefault();

            if (message === '') {
                return;
            }

            props.onSendChat(message);
            setMessage('');
        },
        [message, props]
    );

    const placeholder = props.muted ? 'Spectators cannot chat in this game' : 'Chat...';

    return (
        <div className='relative flex h-full min-h-0 flex-1 flex-col overflow-hidden'>
            <div
                className='messages min-h-0 flex-1 overflow-y-auto rounded-md border border-border/60 bg-black/55 p-1 [scrollbar-gutter:stable]'
                ref={messagePanel}
                onScroll={onScroll}
            >
                <div ref={messageContentRef}>
                    <Messages
                        messages={props.messages}
                        onCardMouseOver={props.onCardMouseOver}
                        onCardMouseOut={props.onCardMouseOut}
                    />
                </div>
            </div>
            {!isPinnedToBottom ? (
                <Button
                    type='button'
                    size='sm'
                    variant='tertiary'
                    className='absolute bottom-14 left-1/2 z-10 -translate-x-1/2'
                    onPress={() => scheduleScrollToBottom(true)}
                >
                    Jump to latest
                </Button>
            ) : null}
            <form className='shrink-0 p-1' onSubmit={onSubmit}>
                <Input
                    className='w-full'
                    placeholder={placeholder}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            onSubmit(event);
                        }
                    }}
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
