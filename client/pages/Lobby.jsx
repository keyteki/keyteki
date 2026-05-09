import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@heroui/react';
import { Trans, useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';

import NewsComponent from '../Components/News/News';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import LobbyChat from '../Components/Lobby/LobbyChat';
import { lobbySendMessage } from '../redux/socketActions';
import { useGetNewsQuery, useRemoveLobbyMessageMutation } from '../redux/api';
import { lobbyActions } from '../redux/slices/lobbySlice';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Lobby = () => {
    const dispatch = useDispatch();
    const bannerNotice = useSelector((state) => state.lobby.bannerNotice);
    const lobbyError = useSelector((state) => state.lobby.lobbyError);
    const messages = useSelector((state) => state.lobby.messages);
    const motd = useSelector((state) => state.lobby.motd);
    const users = useSelector((state) => state.lobby.users);
    const user = useSelector((state) => state.account.user);
    const { data: newsResponse, isLoading: isNewsLoading } = useGetNewsQuery({ limit: 3 });
    const news = newsResponse?.news || [];
    const [popupError, setPopupError] = useState(false);
    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [message, setMessage] = useState('');
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const [removeLobbyMessage] = useRemoveLobbyMessageMutation();

    useEffect(() => {
        if (!lobbyError || popupError) {
            return;
        }

        setPopupError(true);
        toast.danger(t('New users are limited from chatting in the lobby, try again later'));

        const timeout = setTimeout(() => {
            dispatch(lobbyActions.clearChatStatus());
            setPopupError(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, [dispatch, lobbyError, popupError, t]);

    const sendMessage = () => {
        if (message === '') {
            return;
        }

        dispatch(lobbySendMessage('lobbychat', message));

        setMessage('');
        setActiveSuggestionIndex(0);
    };

    const getMentionContext = (value, caretPosition) => {
        const beforeCursor = value.slice(0, caretPosition);
        const mentionMatch = beforeCursor.match(/(^|\s)@([A-Za-z0-9_-]*)$/);

        if (!mentionMatch) {
            return null;
        }

        const query = mentionMatch[2] || '';
        const mentionStart = beforeCursor.length - query.length - 1;

        return {
            mentionStart,
            query
        };
    };

    const isLoggedIn = !!user;
    const placeholder = isLoggedIn
        ? 'Enter a message...'
        : 'You must be logged in to send lobby chat messages';

    const banners = [];

    const containerClass = 'mx-auto w-full max-w-[86%] lg:max-w-[70%] 2xl:max-w-6xl';
    const announcements = [
        ...(bannerNotice
            ? [
                  {
                      message: bannerNotice,
                      type: 'warning'
                  }
              ]
            : [])
    ].slice(0, 3);

    const truncateAnnouncement = (text) => {
        if (!text) {
            return '';
        }

        if (text.length <= 220) {
            return text;
        }

        return `${text.substring(0, 220).trim()}...`;
    };

    const uniqueUsers = Array.from(
        new Map(
            (users || [])
                .filter((onlineUser) => !!onlineUser?.name)
                .map((onlineUser) => [onlineUser.name.toLowerCase(), onlineUser.name])
        ).values()
    );

    const mentionContext = getMentionContext(
        message,
        inputRef.current?.selectionStart ?? message.length
    );
    const mentionSuggestions = mentionContext
        ? uniqueUsers
              .filter((onlineUser) =>
                  onlineUser.toLowerCase().startsWith(mentionContext.query.toLowerCase())
              )
              .slice(0, 8)
        : [];

    const applyMentionSuggestion = (selectedUser) => {
        if (!mentionContext) {
            return;
        }

        const mentionPrefix = message.slice(0, mentionContext.mentionStart);
        const mentionSuffix = message.slice(inputRef.current?.selectionStart ?? message.length);
        const nextMessage = `${mentionPrefix}@${selectedUser} ${mentionSuffix}`;
        const nextCaret = mentionPrefix.length + selectedUser.length + 2;

        setMessage(nextMessage.substring(0, Math.min(512, nextMessage.length)));
        setActiveSuggestionIndex(0);

        requestAnimationFrame(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.setSelectionRange(nextCaret, nextCaret);
            }
        });
    };

    const onInputKeyDown = (event) => {
        if (mentionSuggestions.length > 0) {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActiveSuggestionIndex((index) => (index + 1) % mentionSuggestions.length);
                return;
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveSuggestionIndex((index) =>
                    index - 1 < 0 ? mentionSuggestions.length - 1 : index - 1
                );
                return;
            }

            if (
                (event.key === 'Enter' || event.key === 'Tab') &&
                mentionSuggestions[activeSuggestionIndex]
            ) {
                event.preventDefault();
                applyMentionSuggestion(mentionSuggestions[activeSuggestionIndex]);
                return;
            }
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    const toAlertType = (type) => {
        if (type === 'error') {
            return 'danger';
        }

        return type || 'info';
    };

    return (
        <div className='flex h-[calc(100vh-55px)] flex-col overflow-hidden pb-2 pt-1'>
            <div className={`${containerClass} min-h-0 flex flex-1 flex-col gap-2`}>
                <div className='relative px-0.5 pb-1'>
                    <Carousel
                        autoPlay={true}
                        infiniteLoop={true}
                        showArrows={false}
                        showThumbs={false}
                        showIndicators={false}
                        showStatus={false}
                        interval={7500}
                        onChange={(index) => setActiveBannerIndex(index)}
                    >
                        {banners.map((banner) => {
                            return (
                                <a
                                    key={banner.img}
                                    target='_blank'
                                    rel='noreferrer'
                                    href={banner.link || '#'}
                                    className='block leading-none'
                                    style={{ lineHeight: 0 }}
                                >
                                    <div className='h-30 overflow-hidden rounded-md border border-border/70 bg-surface/90 shadow-[var(--surface-shadow)] sm:h-34'>
                                        <img
                                            src={banner.img}
                                            alt=''
                                            className='block h-full w-full object-fill'
                                        />
                                        <span className='sr-only'>{t('Community banner')}</span>
                                    </div>
                                </a>
                            );
                        })}
                    </Carousel>
                    {banners.length > 0 ? (
                        <div className='pointer-events-none absolute right-3 top-2 rounded bg-overlay/92 px-2 py-0.5 text-xs text-muted shadow-[var(--overlay-shadow)]'>
                            {activeBannerIndex + 1} / {banners.length}
                        </div>
                    ) : null}
                </div>

                {motd?.message && (
                    <AlertPanel className='!mb-0 text-sm' type={toAlertType(motd.motdType)}>
                        {motd.message}
                    </AlertPanel>
                )}

                <Panel
                    type='primary'
                    contentClassName='pb-1'
                    headerVariant='context'
                    title={t('Latest site news')}
                    titleClass='text-xs font-medium tracking-wide'
                >
                    <div>
                        {announcements.length === 0 && news.length === 0 && !isNewsLoading ? (
                            <div className='rounded-md border border-border/60 bg-surface-secondary/70 px-3 py-2 text-sm text-muted'>
                                {t('No announcements')}
                            </div>
                        ) : announcements.length > 0 ? (
                            <div className='grid gap-1'>
                                {announcements.map((item, index) => (
                                    <AlertPanel
                                        key={`${item.type}-${index}`}
                                        className='!mb-0 text-sm'
                                        type={toAlertType(item.type)}
                                    >
                                        {truncateAnnouncement(item.message)}
                                    </AlertPanel>
                                ))}
                            </div>
                        ) : null}
                        <div
                            className={`${
                                announcements.length > 0
                                    ? 'mt-2 border-t border-border/70 pt-2'
                                    : ''
                            }`}
                        >
                            {isNewsLoading ? (
                                <div className='text-xs text-muted'>
                                    <Trans>News loading, please wait...</Trans>
                                </div>
                            ) : null}
                            <NewsComponent news={news} />
                        </div>
                    </div>
                </Panel>

                <Panel
                    className='min-h-0 flex-1'
                    headerVariant='context'
                    title={t('Lobby Chat ({{users}}) online', {
                        users: users.length
                    })}
                    titleClass='text-sm font-semibold tracking-wide'
                >
                    <div className='flex h-full min-h-0 flex-col'>
                        <LobbyChat
                            className='px-1'
                            highlightUsername={user?.username}
                            messages={messages}
                            isModerator={user?.permissions?.canModerateChat}
                            onRemoveMessageClick={(messageId) => removeLobbyMessage(messageId)}
                        />
                        <form
                            className='mt-2'
                            onSubmit={(event) => {
                                event.preventDefault();
                                sendMessage();
                            }}
                        >
                            <div className='relative'>
                                {mentionSuggestions.length > 0 && (
                                    <div className='absolute bottom-full left-0 right-0 z-20 mb-1 rounded-md border border-border/70 bg-overlay/95 p-1 shadow-lg'>
                                        {mentionSuggestions.map((suggestion, index) => {
                                            const isActive = index === activeSuggestionIndex;

                                            return (
                                                <button
                                                    key={suggestion}
                                                    type='button'
                                                    className={`block w-full rounded px-2 py-1 text-left text-sm ${
                                                        isActive
                                                            ? 'bg-accent/20 text-foreground'
                                                            : 'text-muted hover:bg-surface-secondary/70'
                                                    }`}
                                                    onMouseDown={(event) => event.preventDefault()}
                                                    onClick={() =>
                                                        applyMentionSuggestion(suggestion)
                                                    }
                                                >
                                                    @{suggestion}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                <input
                                    ref={inputRef}
                                    id='lobby-chat-input'
                                    type='text'
                                    className='w-full rounded-md border border-border/65 bg-surface-secondary/55 px-3 py-2 text-sm text-foreground placeholder:text-muted shadow-none focus:border-border/90 focus:outline-none dark:border-border/80 dark:bg-surface-secondary/85 dark:placeholder:text-muted dark:shadow-none'
                                    placeholder={t(placeholder)}
                                    value={message}
                                    disabled={!isLoggedIn}
                                    autoFocus
                                    maxLength={512}
                                    onChange={(event) =>
                                        setMessage(
                                            event.target.value.substring(
                                                0,
                                                Math.min(512, event.target.value.length)
                                            )
                                        )
                                    }
                                    onKeyDown={onInputKeyDown}
                                />
                            </div>
                        </form>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

Lobby.displayName = 'Lobby';

export default Lobby;
