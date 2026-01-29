import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';

import { Constants } from './constants';
import ErrorBoundary from './Components/Site/ErrorBoundary';
import Navigation from './Components/Navigation/Navigation';
import Router from './Router';
import { tryParseJSON } from './util';
import AlertPanel from './Components/Site/AlertPanel';
import * as actions from './redux/actions';

import Background from './assets/img/bgs/keyforge.png';
import BlankBg from './assets/img/bgs/blank.png';
import MassMutationBg from './assets/img/bgs/massmutation.png';

class Application extends React.Component {
    constructor(props) {
        super(props);

        this.router = new Router();

        this.onFocusChange = this.onFocusChange.bind(this);
        this.blinkTab = this.blinkTab.bind(this);
        this.state = {};
        this.bgRef = React.createRef();

        this.backgrounds = { blank: BlankBg };

        for (let i = 0; i < Constants.Houses.length; ++i) {
            this.backgrounds[Constants.Houses[i]] = Constants.HouseBgPaths[Constants.Houses[i]];
        }

        this.backgrounds.massmutation = MassMutationBg;
        this.backgrounds.keyforge = Background;
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillMount() {
        if (!localStorage) {
            this.setState({ incompatibleBrowser: true });
        } else {
            try {
                let token = localStorage.getItem('token');
                let refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const parsedToken = tryParseJSON(refreshToken);
                    if (parsedToken) {
                        this.props.setAuthTokens(token, parsedToken);
                        this.props.authenticate();
                    }
                }
            } catch (error) {
                this.setState({ cannotLoad: true });
            }
        }

        this.props.loadCards();
        this.props.loadFactions();
        this.props.loadStandaloneDecks();

        $(document).ajaxError((event, xhr) => {
            if (xhr.status === 403) {
                this.props.navigate('/unauth');
            }
        });

        this.props.connectLobby();
        window.addEventListener('focus', this.onFocusChange);
        window.addEventListener('blur', this.onFocusChange);
    }

    componentDidUpdate(props) {
        if (!props.windowBlurred || this.props.windowBlurred) {
            this.blinkTab();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('focus', this.onFocusChange);
        window.removeEventListener('blur', this.onFocusChange);
    }

    blinkTab() {
        if (!this.props.currentGame || !this.props.currentGame.players) {
            return;
        }

        if (Object.keys(this.props.currentGame.players).length < 2) {
            return;
        }

        const activePlayer = Object.values(this.props.currentGame.players).find(
            (x) => x.activePlayer
        );
        if (
            document.title !== 'Alert!' &&
            activePlayer &&
            this.props.user &&
            activePlayer.name === this.props.user.username
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
    }

    onFocusChange(event) {
        this.props.setWindowBlur(event.type);
    }

    render() {
        let gameBoardVisible =
            this.props.currentGame && this.props.currentGame.started && this.props.path === '/play';

        let component = this.router.resolvePath({
            pathname: this.props.path,
            user: this.props.user,
            currentGame: this.props.currentGame
        });

        if (this.state.incompatibleBrowser) {
            component = (
                <AlertPanel
                    type='error'
                    message='Your browser does not provide the required functionality for this site to work.  Please upgrade your browser.  The site works best with a recent version of Chrome, Safari or Firefox.'
                />
            );
        } else if (this.state.cannotLoad) {
            component = (
                <AlertPanel
                    type='error'
                    message='This site requires the ability to store cookies and local site data to function.  Please enable these features to use the site.'
                />
            );
        }

        let background = 'keyforge';

        if (gameBoardVisible && this.props.user) {
            let houseIndex = Constants.HousesNames.indexOf(this.props.user.settings.background);
            if (houseIndex === -1) {
                background = `${this.props.user?.settings?.background}`;
            } else {
                background = `${Constants.Houses[houseIndex]}`;
            }

            if (
                this.bgRef.current &&
                background === 'custom' &&
                this.props.user.settings.customBackground
            ) {
                this.bgRef.current.style.backgroundImage = `url('/img/bgs/${this.props.user.settings.customBackground}.png')`;
            } else if (this.bgRef.current) {
                this.bgRef.current.style.backgroundImage = `url('${this.backgrounds[background]}')`;
            }
        } else if (this.bgRef.current) {
            this.bgRef.current.style.backgroundImage = `url('${Background}')`;
        }

        return (
            <div className='bg' ref={this.bgRef}>
                <Navigation appName='The Crucible Online' user={this.props.user} />
                <div className='wrapper'>
                    <Container className='content'>
                        <ErrorBoundary
                            navigate={this.props.navigate}
                            errorPath={this.props.path}
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
    }
}

Application.displayName = 'Application';
Application.propTypes = {
    authenticate: PropTypes.func,
    connectLobby: PropTypes.func,
    currentGame: PropTypes.object,
    loadCards: PropTypes.func,
    loadFactions: PropTypes.func,
    loadPacks: PropTypes.func,
    loadRestrictedList: PropTypes.func,
    loadStandaloneDecks: PropTypes.func,
    navigate: PropTypes.func,
    path: PropTypes.string,
    setAuthTokens: PropTypes.func,
    setWindowBlur: PropTypes.func,
    token: PropTypes.string,
    user: PropTypes.object,
    windowBlurred: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
        path: state.navigation.path,
        token: state.account.token,
        user: state.account.user,
        windowBlurred: state.lobby.windowBlurred
    };
}

export default connect(mapStateToProps, actions)(Application);
