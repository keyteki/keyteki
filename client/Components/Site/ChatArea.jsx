import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Textarea } from '@heroui/react';
import classNames from 'classnames';

const ChatArea = forwardRef(function ChatArea(
    {
        className,
        classNames: classNamesProp,
        children,
        isOpen = true,
        messageCount,
        noMessagesLabel,
        onSendMessage,
        isInputDisabled,
        placeholder,
        maxInputLength,
        unreadMessagesLabel,
        onUnreadMessagesChange = () => {}
    },
    ref
) {
    const { t } = useTranslation();
    const localMessageRef = useRef(null);
    const messagesRef = ref || localMessageRef;

    const [isAnchored, setIsAnchored] = useState(true);

    const [message, setMessage] = useState('');
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [lastMessageCount, setLastMessageCount] = useState(0);

    // Tolerance (px) for scroll position to determine if the user is at the bottom
    const scrollTolerance = 25;

    // Determines if the user is "anchored" to the bottom of the chat
    const onScroll = useCallback(() => {
        if (messagesRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - scrollTolerance;
            if (isAtBottom && !isAnchored) {
                setIsAnchored(true);
            } else if (!isAtBottom && isAnchored) {
                setIsAnchored(false);
            }
        }
    }, [isAnchored, messagesRef]);

    // Handles unread update & anchoring when new messages are received
    useEffect(() => {
        const unread = messageCount - lastMessageCount;
        if (isOpen && isAnchored) {
            if (messagesRef.current) {
                // Keep it anchored to the bottom
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
            }
            setLastMessageCount(messageCount);
            setUnreadMessages(0);
            onUnreadMessagesChange(0);
        } else {
            setUnreadMessages(unread);
            onUnreadMessagesChange(unread);
        }
    }, [isOpen, isAnchored, lastMessageCount, messageCount, messagesRef, onUnreadMessagesChange]);

    // Handles anchoring when it changes size (eg. the input box takes up more space due to new line)
    useEffect(() => {
        if (messagesRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                if (isAnchored) {
                    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
                }
            });
            resizeObserver.observe(messagesRef.current);
            return () => resizeObserver.disconnect();
        }
    }, [isAnchored, messagesRef]);

    // Triggers send message
    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (message !== '') {
                onSendMessage(message);
                setMessage('');
            }
        }
    };

    return (
        <div className={classNames('flex flex-col', className, classNamesProp?.wrapper)}>
            <div
                className={classNames('flex-1 overflow-y-auto', classNamesProp?.messages)}
                ref={messagesRef}
                onScroll={onScroll}
            >
                {messageCount > 0 ? children : noMessagesLabel}
            </div>
            <div className='relative'>
                {unreadMessages > 0 && (
                    <Button
                        className='absolute bottom-full bg-default-300 h-5 w-full opacity-80 text-white text-small text-center rounded-t-md'
                        radius='none'
                        onPress={() => setIsAnchored(true)}
                    >
                        {unreadMessagesLabel || t('Click to view unread messages...')}
                    </Button>
                )}
                <Textarea
                    className={typeof classNamesProp?.input !== 'object' && classNamesProp?.input}
                    classNames={{
                        inputWrapper: 'rounded-none',
                        ...(typeof classNamesProp?.input === 'object' && classNamesProp?.input)
                    }}
                    onKeyDown={onKeyDown}
                    onValueChange={setMessage}
                    maxLength={maxInputLength}
                    placeholder={placeholder}
                    disabled={isInputDisabled}
                    value={message}
                    minRows={1}
                />
            </div>
        </div>
    );
});

export default ChatArea;
