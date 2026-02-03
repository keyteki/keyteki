import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import $ from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import { Constants } from './constants';
import ErrorBoundary from './Components/Site/ErrorBoundary';
import Navigation from './Components/Navigation/Navigation';
import AppRoutes from './AppRoutes';
import { tryParseJSON } from './util.jsx';
import AlertPanel from './Components/Site/AlertPanel';
import {
    authenticate,
    connectLobby,
    loadCards,
    loadFactions,
    loadStandaloneDecks,
    setAuthTokens,
    setWindowBlur
} from './redux/actions';

import Background from './assets/img/bgs/keyforge.png';
import BlankBg from './assets/img/bgs/blank.png';
import MassMutationBg from './assets/img/bgs/massmutation.png';

const Application = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const bgRef = useRef(null);
    const [incompatibleBrowser, setIncompatibleBrowser] = useState(false);
    const [cannotLoad, setCannotLoad] = useState(false);
    const prevWindowBlurred = useRef(null);

    const { currentGame, user, windowBlurred } = useSelector((state) => ({
        currentGame: state.lobby.currentGame,
        user: state.account.user,
        windowBlurred: state.lobby.windowBlurred
    }));

    const backgrounds = useMemo(() => {
        const values = { blank: BlankBg };

        for (let i = 0; i < Constants.Houses.length; ++i) {
            values[Constants.Houses[i]] = Constants.HouseBgPaths[Constants.Houses[i]];
        }

        values.massmutation = MassMutationBg;
        values.keyforge = Background;

        return values;
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
                        dispatch(authenticate());
                    }
                }
            } catch (error) {
                setCannotLoad(true);
            }
        }

        dispatch(loadCards());
        dispatch(loadFactions());
        dispatch(loadStandaloneDecks());

        const handleAjaxError = (event, xhr) => {
            if (xhr.status === 403) {
                navigate('/unauth');
            }
        };

        $(document).ajaxError(handleAjaxError);

        dispatch(connectLobby());

        const onFocusChange = (event) => {
            dispatch(setWindowBlur(event.type));
        };

        window.addEventListener('focus', onFocusChange);
        window.addEventListener('blur', onFocusChange);

        return () => {
            $(document).off('ajaxError', handleAjaxError);
            window.removeEventListener('focus', onFocusChange);
            window.removeEventListener('blur', onFocusChange);
        };
    }, [dispatch, navigate]);

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
            let timeoutId = false;

            let blink = function () {
                document.title = document.title === msg ? oldTitle : msg;

                if (document.hasFocus()) {
                    document.title = oldTitle;
                    clearInterval(timeoutId);
                }
            };

            if (!timeoutId) {
                timeoutId = setInterval(blink, 500);
            }
        }
    }, [currentGame, user]);

    useEffect(() => {
        const previous = prevWindowBlurred.current;
        if (previous === null || !previous || windowBlurred) {
            blinkTab();
        }
        prevWindowBlurred.current = windowBlurred;
    }, [blinkTab, windowBlurred]);

    const path = location?.pathname || '/';
    const gameBoardVisible = currentGame && currentGame.started && path === '/play';

    useEffect(() => {
        if (!bgRef.current) {
            return;
        }

        if (gameBoardVisible && user && user.settings) {
            let background = 'keyforge';
            let houseIndex = Constants.HousesNames.indexOf(user.settings.background);
            if (houseIndex === -1) {
                background = `${user?.settings?.background}`;
            } else {
                background = `${Constants.Houses[houseIndex]}`;
            }

            if (background === 'custom' && user.settings.customBackground) {
                bgRef.current.style.backgroundImage = `url('/img/bgs/${user.settings.customBackground}.png')`;
            } else {
                bgRef.current.style.backgroundImage = `url('${backgrounds[background]}')`;
            }
            return;
        }

        bgRef.current.style.backgroundImage = `url('${Background}')`;
    }, [backgrounds, gameBoardVisible, user]);

    let component = <AppRoutes user={user} currentGame={currentGame} />;

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

    return (
        <div className='bg' ref={bgRef}>
            <Navigation appName='The Crucible Online' user={user} />
            <div className='wrapper'>
                <Container className='content'>
                    <ErrorBoundary
                        navigate={navigate}
                        errorPath={path}
                        message={"We're sorry - something's gone wrong."}
                    >
                        {component}
                    </ErrorBoundary>
                </Container>
            </div>
            <div className='keyforge-font' style={{ zIndex: -999 }}>
                &nbsp;
            </div>
        </div>
    );
};

Application.displayName = 'Application';

export default Application;
