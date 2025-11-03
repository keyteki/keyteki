import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Trans, useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';

import NewsComponent from '../Components/News/News';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import SideBar from '../Components/Lobby/SideBar';
import UserList from '../Components/Lobby/UserList';
import LobbyChat from '../Components/Lobby/LobbyChat';
import { Textarea } from '@heroui/react';
import { clearChatStatus } from '../redux/actions/misc';
import { removeLobbyMessage } from '../redux/actions/lobby';
import { sendSocketMessage } from '../redux/actions/socket';
import { useLoadNewsQuery } from '../redux/slices/apiSlice';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Lobby = () => {
    const dispatch = useDispatch();
    const { bannerNotice, lobbyError, messages, motd, users } = useSelector((state) => ({
        bannerNotice: state.lobby.bannerNotice,
        lobbyError: state.lobby.lobbyError,
        messages: state.lobby.messages,
        motd: state.lobby.motd,
        users: state.lobby.users
    }));
    const user = useSelector((state) => state.account.user);
    const { data: news = [], isLoading: newsLoading } = useLoadNewsQuery(undefined);
    const [popupError, setPopupError] = useState(false);
    const [message, setMessage] = useState('');
    const { t } = useTranslation();
    const messageRef = useRef(null);

    if (!popupError && lobbyError) {
        setPopupError(true);

        toastr.error('Error', 'New users are limited from chatting in the lobby, try again later');

        setTimeout(() => {
            dispatch(clearChatStatus());
            setPopupError(false);
        }, 5000);
    }

    const sendMessage = () => {
        if (message === '') {
            return;
        }

        dispatch(sendSocketMessage('lobbychat', message));

        setMessage('');
    };

    const onKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            sendMessage();

            messageRef.current?.clear();
        }
    };

    let isLoggedIn = !!user;
    let placeholder = isLoggedIn
        ? 'Enter a message...'
        : 'You must be logged in to send lobby chat messages';

    const banners = [
        {
            img: 'banner/mwkfco-banner-tco.jpg',
            link: 'https://bestmidwestkeyforgeevents.com/'
        }
    ];

    return (
        <div className='flex flex-col h-full'>
            <SideBar>
                <UserList users={users} />
            </SideBar>
            <div className='flex-1'>
                <div className='mx-auto max-w-6xl px-4'>
                    <Carousel
                        autoPlay={true}
                        infiniteLoop={true}
                        showArrows={false}
                        showThumbs={false}
                        showIndicators={false}
                        showStatus={false}
                        interval={7500}
                    >
                        {banners.map((banner) => {
                            return (
                                <a
                                    key={banner.img}
                                    target='_blank'
                                    rel='noreferrer'
                                    href={banner.link || '#'}
                                >
                                    <div>
                                        <img src={banner.img} />
                                    </div>
                                </a>
                            );
                        })}
                    </Carousel>
                </div>

                {motd?.message && (
                    <div className='mx-auto max-w-6xl px-4'>
                        <AlertPanel type={motd.motdType} message={motd.message}></AlertPanel>
                    </div>
                )}
                {bannerNotice && (
                    <div className='mx-auto max-w-6xl px-4'>
                        <AlertPanel message={bannerNotice} type='error' />
                    </div>
                )}
                <div className='mx-auto max-w-6xl px-4'>
                    <Panel title={t('Latest site news')}>
                        {newsLoading ? (
                            <div>
                                <Trans>News loading, please wait...</Trans>
                            </div>
                        ) : null}
                        <NewsComponent news={news} />
                    </Panel>
                </div>
                <div className='mx-auto max-w-6xl px-4 flex flex-col flex-1 relative'>
                    <Panel
                        title={t('Lobby Chat ({{users}}) online', {
                            users: users.length
                        })}
                    >
                        <div className='flex-1 mb-2'>
                            <LobbyChat
                                messages={messages}
                                isModerator={user?.permissions?.canModerateChat}
                                onRemoveMessageClick={(messageId) =>
                                    dispatch(removeLobbyMessage(messageId))
                                }
                            />
                        </div>
                    </Panel>
                    <form
                        className='absolute bottom-0 left-4 right-4'
                        onSubmit={(event) => {
                            event.preventDefault();
                            sendMessage();
                        }}
                    >
                        <div>
                            <div className='mx-1.5 mt-1.5'>
                                <Textarea
                                    disabled={!isLoggedIn}
                                    ref={messageRef}
                                    value={message}
                                    placeholder={t(placeholder)}
                                    labelKey={'name'}
                                    onKeyDown={onKeyPress}
                                    options={users}
                                    onInputChange={(value) =>
                                        setMessage(value.substring(0, Math.min(512, value.length)))
                                    }
                                    autoFocus
                                    dropup
                                    emptyLabel={''}
                                    minLength={2}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

Lobby.displayName = 'Lobby';

export default Lobby;
