import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import Login from './Login.jsx';
import Logout from './Logout.jsx';
import Register from './Register.jsx';
import Lobby from './Lobby.jsx';
import Decks from './Decks.jsx';
import AddDeck from './AddDeck.jsx';
import EditDeck from './EditDeck.jsx';
import NotFound from './NotFound.jsx';
import NavBar from './NavBar.jsx';
import GameLobby from './GameLobby.jsx';
import GameBoard from './GameBoard.jsx';
import HowToPlay from './HowToPlay.jsx';
import About from './About.jsx';
import Community from './Community.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import ResetPassword from './ResetPassword.jsx';
import Profile from './Profile.jsx';
import NewsAdmin from './NewsAdmin.jsx';
import Unauthorised from './Unauthorised.jsx';
import UserAdmin from './UserAdmin.jsx';
import BlockList from './BlockList.jsx';

import { toastr } from 'react-redux-toastr';

import version from '../version.js';

import * as actions from './actions';

class App extends React.Component {
    constructor(props) {
        super(props);

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

        this.paths = {
            '/': () => <Lobby />,
            '/login': () => <Login />,
            '/register': () => <Register />,
            '/decks': () => <Decks { ...boundActionCreators } />,
            '/decks/add': () => <AddDeck />,
            '/decks/edit': params => <EditDeck deckId={ params.deckId } />,
            '/play': () => (this.props.currentGame && this.props.currentGame.started) ? <GameBoard /> : <GameLobby />,
            '/how-to-play': () => <HowToPlay />,
            '/about': () => <About />,
            '/community': () => <Community />,
            '/forgot': () => <ForgotPassword />,
            '/reset-password': params => <ResetPassword id={ params.id } token={ params.token } />,
            '/profile': () => <Profile />,
            '/news': () => <NewsAdmin />
        };
    }

    componentWillMount() {
        this.props.loadCards();
        this.props.loadPacks();
        this.props.loadFactions();

        $(document).ajaxError((event, xhr) => {
            if(xhr.status === 401) {
                this.props.navigate('/login');
            } else if(xhr.status === 403) {
                this.props.navigate('/unauth');
            }
        });

        let queryString = this.props.token ? 'token=' + this.props.token + '&' : '';
        queryString += 'version=' + version;

        let socket = io.connect(window.location.origin, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            query: queryString
        });

        socket.on('connect', () => {
            this.props.socketConnected(socket);
        });

        socket.on('disconnect', () => {
            toastr.error('Connection lost', 'You have been disconnected from the lobby server, attempting reconnect..');
        });

        socket.on('reconnect', () => {
            toastr.success('Reconnected', 'The reconnection to the lobby has been successful');
            this.props.socketConnected(socket);
        });

        socket.on('games', games => {
            this.props.receiveGames(games);
        });

        socket.on('users', users => {
            this.props.receiveUsers(users);
        });

        socket.on('newgame', game => {
            this.props.receiveNewGame(game);
        });

        socket.on('gamestate', game => {
            this.props.receiveGameState(game, this.props.username);
        });

        socket.on('cleargamestate', () => {
            this.props.clearGameState();
        });

        socket.on('lobbychat', message => {
            this.props.receiveLobbyMessage(message);
        });

        socket.on('lobbymessages', messages => {
            this.props.receiveLobbyMessages(messages);
        });

        socket.on('passworderror', message => {
            this.props.receivePasswordError(message);
        });

        socket.on('handoff', server => {
            let url = '//' + server.address;
            if(server.port && server.port !== 80 && server.port !== 443) {
                url += ':' + server.port;
            }

            if(this.props.gameSocket) {
                this.props.closeGameSocket();
            }

            this.props.gameSocketConnecting(url + '/' + server.name);

            let gameSocket = io.connect(url, {
                path: '/' + server.name + '/socket.io',
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5,
                query: this.props.token ? 'token=' + this.props.token : undefined
            });

            gameSocket.on('connect_error', (err) => {
                toastr.error('Connect Error', 'There was an error connecting to the game server: ' + err.message + '(' + err.description + ')');
            });

            gameSocket.on('disconnect', () => {
                if(!gameSocket.gameClosing) {
                    toastr.error('Connection lost', 'You have been disconnected from the game server');
                }

                this.props.gameSocketDisconnect();
            });

            gameSocket.on('reconnecting', (attemptNumber) => {
                toastr.info('Reconnecting', 'Attempt number ' + attemptNumber + ' to reconnect..');

                this.props.gameSocketReconnecting(attemptNumber);
            });

            gameSocket.on('reconnect', () => {
                toastr.success('Reconnected', 'The reconnection has been successful');
                this.props.gameSocketConnected(gameSocket);
            });

            gameSocket.on('reconnect_failed', () => {
                toastr.error('Reconnect failed', 'Given up trying to connect to the server');
                this.props.sendGameSocketConnectFailed();
            });

            gameSocket.on('connect', () => {
                this.props.gameSocketConnected(gameSocket);
            });

            gameSocket.on('gamestate', game => {
                this.props.receiveGameState(game, this.props.username);
            });

            gameSocket.on('cleargamestate', () => {
                this.props.clearGameState();
            });
        });

        socket.on('banner', notice => {
            this.props.receiveBannerNotice(notice);
        });
    }

    componentDidUpdate() {
        this.props.receiveLobbyMessage({});
        if(!this.props.currentGame) {
            this.props.setContextMenu([]);
        }
    }

    getUrlParameter(name) {
        name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(location.search);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    render() {
        let rightMenu;

        if(!this.props.user) {
            rightMenu = [
                { name: 'Login', path: '/login' },
                { name: 'Register', path: '/register' }
            ];
        } else {
            rightMenu = [
                {
                    name: this.props.user.username, childItems: [
                        { name: 'Profile', path: '/profile' },
                        { name: 'Block List', path: '/blocklist' },
                        { name: 'Logout', path: '/logout' }
                    ], avatar: true, emailHash: this.props.user.emailHash, disableGravatar: this.props.user.settings.disableGravatar
                }
            ];
        }

        let leftMenu = [
            { name: 'Decks', path: '/decks' },
            { name: 'Play', path: '/play' },
            {
                name: 'Help', childItems: [
                    { name: 'How To Play', path: '/how-to-play' },
                    { name: 'About', path: '/about' },
                    { name: 'Community', path: '/community' }
                ]
            }
        ];

        let adminMenuItems = [];
        let permissions = {};

        if(this.props.user && this.props.user.permissions) {
            permissions = this.props.user.permissions;

            if(permissions.canEditNews) {
                adminMenuItems.push({ name: 'News', path: '/news' });
            }

            if(permissions.canManageUsers) {
                adminMenuItems.push({ name: 'Users', path: '/users' });
            }
        }

        if(_.size(adminMenuItems) > 0) {
            leftMenu.push({ name: 'Admin', childItems: adminMenuItems });
        }

        let component = {};

        let path = this.props.path;
        let argIndex = path.lastIndexOf('/');
        let arg;

        let page = this.paths[path];
        if(!page) {
            if(argIndex !== -1 && argIndex !== 0) {
                arg = path.substring(argIndex + 1);
                path = path.substring(0, argIndex);
            }

            let page = this.paths[path];
            if(!page) {
                page = this.paths[this.props.path];
                arg = undefined;
            }
        }

        let idArg;
        let tokenArg;
        let index;
        let gameBoardVisible = false;

        index = path.indexOf('/reset-password');
        if(index !== -1) {
            idArg = this.getUrlParameter('id');
            tokenArg = this.getUrlParameter('token');
        }

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

        switch(path) {
            case '/':
                component = <Lobby />;
                break;
            case '/login':
                component = <Login />;
                break;
            case '/logout':
                component = <Logout />;
                break;
            case '/register':
                component = <Register />;
                break;
            case '/decks':
                component = <Decks { ...boundActionCreators } />;
                break;
            case '/decks/add':
                component = <AddDeck />;
                break;
            case '/decks/edit':
                component = <EditDeck deckId={ arg } />;
                break;
            case '/play':
                if(this.props.currentGame && this.props.currentGame.started) {
                    component = <GameBoard />;
                    gameBoardVisible = true;
                } else {
                    component = <GameLobby />;
                }

                break;
            case '/how-to-play':
                component = <HowToPlay />;
                break;
            case '/about':
                component = <About />;
                break;
            case '/community':
                component = <Community />;
                break;
            case '/forgot':
                component = <ForgotPassword />;
                break;
            case '/reset-password':
                component = <ResetPassword id={ idArg } token={ tokenArg } />;
                break;
            case '/profile':
                component = <Profile />;
                break;
            case '/news':
                if(!permissions.canEditNews) {
                    component = <Unauthorised />;
                } else {
                    component = <NewsAdmin />;
                }

                break;
            case '/unauth':
                component = <Unauthorised />;
                break;
            case '/users':
                if(!permissions.canManageUsers) {
                    component = <Unauthorised />;
                } else {
                    component = <UserAdmin />;
                }

                break;
            case '/blocklist':
                component = <BlockList />;
                break;
            default:
                component = <NotFound />;
                break;
        }
        
        let backgroundClass = 'bg';
        if(gameBoardVisible && this.props.user) {
            switch(this.props.user.settings.background) {
                case 'CRAB':
                    backgroundClass = 'bg-board-crab';
                    break;
                case 'CRANE':
                    backgroundClass = 'bg-board-crane';
                    break;
                case 'DRAGON':
                    backgroundClass = 'bg-board-dragon';
                    break;
                case 'LION':
                    backgroundClass = 'bg-board-lion';
                    break;
                case 'MANTIS':
                    backgroundClass = 'bg-board-mantis';
                    break;
                case 'PHOENIX':
                    backgroundClass = 'bg-board-phoenix';
                    break;
                case 'SCORPION':
                    backgroundClass = 'bg-board-scorpion';
                    break;
                case 'SPIDER':
                    backgroundClass = 'bg-board-spider';
                    break;
                case 'UNICORN':
                    backgroundClass = 'bg-board-unicorn';
                    break;
                default:
                    backgroundClass = '';
                    break;
            }
        }

        return (<div className={ backgroundClass }>
            <NavBar leftMenu={ leftMenu } rightMenu={ rightMenu } title='Jigoku Online' currentPath={ this.props.path } numGames={ this.props.games.length } />
            <div className='container'>
                { component }
            </div>
        </div>);
    }
}

App.displayName = 'Application';
App.propTypes = {
    clearGameState: PropTypes.func,
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
    disconnecting: PropTypes.bool,
    dispatch: PropTypes.func,
    gameSocket: PropTypes.object,
    gameSocketConnectError: PropTypes.func,
    gameSocketConnected: PropTypes.func,
    gameSocketConnecting: PropTypes.func,
    gameSocketDisconnect: PropTypes.func,
    gameSocketReconnecting: PropTypes.func,
    games: PropTypes.array,
    loadCards: PropTypes.func,
    loadFactions: PropTypes.func,
    loadPacks: PropTypes.func,
    loggedIn: PropTypes.bool,
    navigate: PropTypes.func,
    path: PropTypes.string,
    receiveBannerNotice: PropTypes.func,
    receiveGameState: PropTypes.func,
    receiveGames: PropTypes.func,
    receiveJoinGame: PropTypes.func,
    receiveLobbyMessage: PropTypes.func,
    receiveLobbyMessages: PropTypes.func,
    receiveNewGame: PropTypes.func,
    receivePasswordError: PropTypes.func,
    receiveUsers: PropTypes.func,
    sendGameSocketConnectFailed: PropTypes.func,
    setContextMenu: PropTypes.func,
    socketConnected: PropTypes.func,
    token: PropTypes.string,
    user: PropTypes.object,
    username: PropTypes.string
};

function mapStateToProps(state) {
    return {
        currentGame: state.games.currentGame,
        disconnecting: state.socket.gameDisconnecting,
        gameSocket: state.socket.gameSocket,
        games: state.games.games,
        path: state.navigation.path,
        loggedIn: state.auth.loggedIn,
        token: state.auth.token,
        user: state.auth.user,
        username: state.auth.username
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

const Application = connect(mapStateToProps, mapDispatchToProps)(App);

export default Application;
