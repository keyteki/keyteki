import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import * as Sentry from '@sentry/react';

import { Constants } from './constants';
import Navigation from './Components/Navigation/Navigation';
import Router from './Router.jsx';
import { tryParseJSON } from './util.jsx';
import AlertPanel from './Components/Site/AlertPanel';
import ErrorMessage from './Components/Site/ErrorMessage';
import { setAuthTokens, setUser } from './redux/slices/authSlice';
import { connectLobby } from './redux/slices/lobbySlice';
import { windowBlur, windowFocus, sendAuthenticate } from './redux/slices/lobbySlice';
import {
    useLoadCardsQuery,
    useLoadFactionsQuery,
    useLoadStandaloneDecksQuery,
    useVerifyAuthMutation
} from './redux/slices/apiSlice';

import Background from './assets/img/bgs/keyforge.png';
import BlankBg from './assets/img/bgs/blank.png';
import MassMutationBg from './assets/img/bgs/massmutation.png';

const Application = ({ navigate }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const currentGame = useSelector((state) => state.lobby.currentGame);
    const path = useSelector((state) => state.navigation.path);
    const { user } = useSelector((state) => state.auth);
    const windowBlurred = useSelector((state) => state.lobby.windowBlurred);

    const [incompatibleBrowser, setIncompatibleBrowser] = useState(false);
    const [cannotLoad, setCannotLoad] = useState(false);

    // Load reference data via RTK Query
    useLoadCardsQuery(undefined);
    useLoadFactionsQuery(undefined);
    useLoadStandaloneDecksQuery(undefined);
    const [verifyAuth] = useVerifyAuthMutation();

    const bgRef = useRef(null);
    const router = new Router();
    const blinkIntervalRef = useRef(null);

    const backgrounds = useRef({
        blank: BlankBg,
        massmutation: MassMutationBg,
        keyforge: Background
    });

    useEffect(() => {
        for (let i = 0; i < Constants.Houses.length; ++i) {
            backgrounds.current[Constants.Houses[i]] = Constants.HouseBgPaths[Constants.Houses[i]];
        }
    }, []);

    useEffect(() => {
        if (!localStorage) {
            setIncompatibleBrowser(true);
        } else {
            try {
                let token = localStorage.getItem('token');
                let refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const parsedToken = tryParseJSON(refreshToken);
                    if (parsedToken) {
                        dispatch(setAuthTokens(token, parsedToken));
                        // Verify current auth token and set user if returned
                        (async () => {
                            try {
                                const res = await verifyAuth().unwrap();
                                if (res && res.user) {
                                    dispatch(setUser(res.user));
                                }
                            } catch (e) {
                                // ignore, baseQueryWithReauth will handle 401 -> navigate('/login')
                            }
                        })();
                        // Send authenticate to lobby with current token
                        if (token) {
                            dispatch(sendAuthenticate(token));
                        }
                    }
                }
            } catch (error) {
                setCannotLoad(true);
            }
        }

        $(document).ajaxError((event, xhr) => {
            if (xhr.status === 403) {
                navigate('/unauth');
            }
        });

        dispatch(connectLobby());
    }, [dispatch, navigate, verifyAuth]);

    const onFocusChange = useCallback(
        (event) => {
            if (event.type === 'blur') {
                dispatch(windowBlur());
            } else {
                dispatch(windowFocus());
            }
        },
        [dispatch]
    );

    useEffect(() => {
        window.addEventListener('focus', onFocusChange);
        window.addEventListener('blur', onFocusChange);

        return () => {
            window.removeEventListener('focus', onFocusChange);
            window.removeEventListener('blur', onFocusChange);
        };
    }, [onFocusChange]);

    const blinkTab = useCallback(() => {
        if (!currentGame || !currentGame.players) {
            return;
        }

        if (Object.keys(currentGame.players).length < 2) {
            return;
        }

        const activePlayer = Object.values(currentGame.players).find((x) => x.activePlayer);
        if (
            document.title !== 'Alert!' &&
            activePlayer &&
            user &&
            activePlayer.name === user.username
        ) {
            let oldTitle = document.title;
            let msg = 'Alert!';

            let blink = function () {
                document.title = document.title === msg ? oldTitle : msg;

                if (document.hasFocus()) {
                    document.title = oldTitle;
                    if (blinkIntervalRef.current) {
                        clearInterval(blinkIntervalRef.current);
                        blinkIntervalRef.current = null;
                    }
                }
            };

            if (!blinkIntervalRef.current) {
                blinkIntervalRef.current = setInterval(blink, 500);
            }
        }
    }, [currentGame, user]);

    useEffect(() => {
        if (!windowBlurred) {
            blinkTab();
        }
    }, [windowBlurred, blinkTab]);

    useEffect(() => {
        return () => {
            if (blinkIntervalRef.current) {
                clearInterval(blinkIntervalRef.current);
            }
        };
    }, []);

    let gameBoardVisible = currentGame && currentGame.started && path === '/play';

    let component = router.resolvePath({
        pathname: path,
        user: user,
        currentGame: currentGame
    });

    if (incompatibleBrowser) {
        component = (
            <AlertPanel
                type='error'
                message='Your browser does not provide the required functionality for this site to work.  Please upgrade your browser.  The site works best with a recent version of Chrome, Safari or Firefox.'
            />
        );
    } else if (cannotLoad) {
        component = (
            <AlertPanel
                type='error'
                message='This site requires the ability to store cookies and local site data to function.  Please enable these features to use the site.'
            />
        );
    }

    let background = 'keyforge';

    if (gameBoardVisible && user) {
        let houseIndex = Constants.HousesNames.indexOf(user.settings.background);
        if (houseIndex === -1) {
            background = `${user?.settings?.background}`;
        } else {
            background = `${Constants.Houses[houseIndex]}`;
        }

        if (bgRef.current && background === 'custom' && user.settings.customBackground) {
            bgRef.current.style.backgroundImage = `url('/img/bgs/${user.settings.customBackground}.png')`;
        } else if (bgRef.current) {
            bgRef.current.style.backgroundImage = `url('${backgrounds.current[background]}')`;
        }
    } else if (bgRef.current) {
        bgRef.current.style.backgroundImage = `url('${Background}')`;
    }

    const containerClass = classNames('container h-full relative z-0', {
        'max-w-full': gameBoardVisible
    });

    return (
        <>
            <Navigation appName='The Crucible Online' user={user} />
            <main role='main'>
                <div
                    className='absolute bottom-0 left-0 right-0 top-[3rem] bg-cover bg-center bg-no-repeat overflow-y-auto'
                    ref={bgRef}
                >
                    <Sentry.ErrorBoundary
                        fallback={
                            <ErrorMessage
                                title={t('Unexpected Error')}
                                message={t('Report has been automatically submitted')}
                            />
                        }
                    >
                        <div className='w-full h-full'>
                            <div className={containerClass}>{component}</div>
                        </div>
                    </Sentry.ErrorBoundary>
                </div>
            </main>
            <div className='keyforge-font' style={{ zIndex: -999 }}>
                &nbsp;
            </div>
        </>
    );
};

Application.displayName = 'Application';
Application.propTypes = {
    navigate: PropTypes.func
};

export default Application;
