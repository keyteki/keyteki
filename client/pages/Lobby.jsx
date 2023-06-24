import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Trans, useTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';
import { Carousel } from 'react-responsive-carousel';

import NewsComponent from '../Components/News/News';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Typeahead from '../Components/Form/Typeahead';
import SideBar from '../Components/Lobby/SideBar';
import UserList from '../Components/Lobby/UserList';
import LobbyChat from '../Components/Lobby/LobbyChat';
import { clearChatStatus, loadNews, removeLobbyMessage, sendSocketMessage } from '../redux/actions';
import { News } from '../redux/types';

import './Lobby.scss';
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
    const news = useSelector((state) => state.news.news);
    const apiState = useSelector((state) => {
        const retState = state.api[News.RequestNews];

        return retState;
    });
    const [popupError, setPopupError] = useState(false);
    const [message, setMessage] = useState('');
    const { t } = useTranslation();
    const messageRef = useRef(null);

    useEffect(() => {
        dispatch(loadNews({ limit: 3 }));
    }, [dispatch]);

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
            img: '/banner/happygee-v3.png',
            link: 'https://geeb.us/bpptco'
        }
    ];

    return (
        <div className='flex-container'>
            <SideBar>
                <UserList users={users} />
            </SideBar>
            <div>
                <Col sm={{ span: 10, offset: 1 }}>
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
                                    href={banner.link}
                                >
                                    <div className='banner'>
                                        <img src={banner.img} />
                                    </div>
                                </a>
                            );
                        })}
                    </Carousel>
                </Col>
            </div>

            {motd?.message && (
                <div>
                    <Col sm={{ span: 10, offset: 1 }} className='banner'>
                        <AlertPanel type={motd.motdType} message={motd.message}></AlertPanel>
                    </Col>
                </div>
            )}
            {bannerNotice && (
                <div>
                    <Col sm={{ span: 10, offset: 1 }} className='annoucement'>
                        <AlertPanel message={bannerNotice} type='error' />
                    </Col>
                </div>
            )}
            <div>
                <Col sm={{ span: 10, offset: 1 }}>
                    <Panel title={t('Latest site news')}>
                        {apiState?.loading ? (
                            <div>
                                <Trans>News loading, please wait...</Trans>
                            </div>
                        ) : null}
                        <NewsComponent news={news} />
                    </Panel>
                </Col>
            </div>
            <Col sm={{ span: 10, offset: 1 }} className='chat-container'>
                <Panel
                    title={t('Lobby Chat ({{users}}) online', {
                        users: users.length
                    })}
                >
                    <div>
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
                    className='form form-hozitontal chat-box-container'
                    onSubmit={(event) => {
                        event.preventDefault();
                        sendMessage();
                    }}
                >
                    <div className='form-group'>
                        <div className='chat-box'>
                            <Typeahead
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
            </Col>
        </div>
    );
};

Lobby.displayName = 'Lobby';

export default Lobby;
