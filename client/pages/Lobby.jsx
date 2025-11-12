import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';

import News from '../Components/News/News';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import LobbyChat from '../Components/Lobby/LobbyChat';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import Page from './Page';
import { useLoadNewsQuery } from '../redux/slices/apiSlice';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Lobby = () => {
    const { bannerNotice, lobbyError, messages, motd, users } = useSelector((state) => ({
        bannerNotice: state.lobby.bannerNotice,
        lobbyError: state.lobby.lobbyError,
        messages: state.lobby.messages,
        motd: state.lobby.motd,
        users: state.lobby.users
    }));
    const user = useSelector((state) => state.auth.user);
    const {
        data: news,
        isLoading: newsLoading,
        isError: newsError,
        isSuccess: newsSuccess
    } = useLoadNewsQuery();
    const [popupError, setPopupError] = useState(false);
    const { t } = useTranslation();

    if (!popupError && lobbyError) {
        setPopupError(true);

        toastr.error('Error', 'New users are limited from chatting in the lobby, try again later');

        setTimeout(() => {
            setPopupError(false);
        }, 5000);
    }

    const banners = [
        {
            img: 'banner/mwkfco-banner-tco.jpg',
            link: 'https://bestmidwestkeyforgeevents.com/'
        }
    ];

    let newsInfo = null;
    if (newsLoading) {
        newsInfo = <LoadingSpinner />;
    } else if (newsError) {
        newsInfo = <AlertPanel variant='danger'>Site news failed to load</AlertPanel>;
    } else if (newsSuccess) {
        newsInfo = <News news={news} />;
    }

    return (
        <Page className='h-full'>
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

            {motd?.message && <AlertPanel type={motd.motdType} message={motd.message}></AlertPanel>}
            {bannerNotice && <AlertPanel message={bannerNotice} type='error' />}
            <Panel className='max-h-[20vh]' title={t('Latest site news')}>
                {newsInfo}
            </Panel>
            <Panel
                className='flex-grow overflow-y-auto min-h-64'
                title={t('Lobby Chat ({{users}}) online', {
                    users: users.length
                })}
            >
                <LobbyChat
                    isLoggedIn={!!user}
                    messages={messages}
                    isModerator={user && user.permissions.canModerateChat}
                    lobbyError={lobbyError}
                />
            </Panel>
        </Page>
    );
};

Lobby.displayName = 'Lobby';

export default Lobby;
