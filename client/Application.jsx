import React from 'react';
import $ from 'jquery';
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
import About from './About.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import ResetPassword from './ResetPassword.jsx';
import Profile from './Profile.jsx';

import {toastr} from 'react-redux-toastr';

import version from '../version.js';

import * as actions from './actions';

var notAuthedMenu = [
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' }
];

var authedMenu = [
    { name: 'Profile', path: '/profile' },
    { name: 'Logout', path: '/logout' }
];

var leftMenu = [
    { name: 'Decks', path: '/decks' },
    { name: 'Play', path: '/play' },
    { name: 'About', path: '/about' }
];

var lobby = <Lobby />;
var login = <Login />;
var logout = <Logout />;
var register = <Register />;
var decks = <Decks />;
var gameBoard = <GameBoard />;
var gameLobby = <GameLobby />;
var about = <About />;
var forgot = <ForgotPassword />;
var profile = <Profile />;

class App extends React.Component {
    componentWillMount() {
        this.props.fetchCards();
        this.props.fetchPacks();

        $(document).ajaxError((event, xhr) => {
            if(xhr.status === 401) {
                this.props.navigate('/login');
            }
        });

        var queryString = this.props.token ? 'token=' + this.props.token + '&' : '';
        queryString += 'version=' + version;

        var socket = io.connect(window.location.origin, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
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
            var url = '//' + server.address;
            if(server.port && server.port !== 80 && server.port !== 443) {
                url += ':' + server.port;
            }

            this.props.gameSocketConnecting(url + '/' + server.name);

            var gameSocket = io.connect(url, {
                path: '/' + server.name + '/socket.io',
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax : 5000,
                reconnectionAttempts: 5,
                query: this.props.token ? 'token=' + this.props.token : undefined
            });

            gameSocket.on('connect_error', (err) => {
                toastr.error('Connect Error', 'There was an error connecting to the game server: ' + err.message + '(' + err.description + ')');
            });

            gameSocket.on('disconnect', () => {
                toastr.error('Connection lost', 'You have been disconnected from the game server, attempting reconnect..');

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
    }

    getUrlParameter(name) {
        name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    render() {
        var rightMenu = this.props.loggedIn ? authedMenu : notAuthedMenu;
        var component = {};

        var path = this.props.path;
        var pathArg = undefined;
        var idArg = undefined;
        var tokenArg = undefined;
        var index = path.indexOf('/decks/edit');

        if(index !== -1) {
            path = path.substr(index, 11);
            pathArg = this.props.path.substr(11 + 1);
        }

        index = path.indexOf('/reset-password');
        if(index !== -1) {
            path = path.substr(index, 15);
            idArg = this.getUrlParameter('id');
            tokenArg = this.getUrlParameter('token');
        }

        switch(path) {
            case '/':
                component = lobby;
                break;
            case '/login':
                component = login;
                break;
            case '/logout':
                component = logout;
                break;
            case '/register':
                component = register;
                break;
            case '/decks':
                component = decks;
                break;
            case '/decks/add':
                component = <AddDeck cards={this.props.cards} packs={this.props.packs} agendas={this.props.agendas} />;
                break;
            case '/decks/edit':
                component = <EditDeck cards={this.props.cards} packs={this.props.packs} agendas={this.props.agendas} deckId={pathArg} />;
                break;
            case '/play':
                component = (this.props.currentGame && this.props.currentGame.started) ? gameBoard : gameLobby;
                break;
            case '/about':
                component = about;
                break;
            case '/forgot':
                component = forgot;
                break;
            case '/reset-password':
                component = <ResetPassword id={ idArg } token={ tokenArg } />;
                break;
            case '/profile':
                component = profile;
                break;
            default:
                component = <NotFound />;
                break;
        }

        return (<div>
            <NavBar leftMenu={leftMenu} rightMenu={rightMenu} title='Egg of P'an Ku currentPath={this.props.path} numGames={this.props.games.length} />
            <div className='container'>
                {component}
            </div>
        </div>);
    }
}

App.displayName = 'Application';
App.propTypes = {
    agendas: React.PropTypes.array,
    cards: React.PropTypes.array,
    clearGameState: React.PropTypes.func,
    currentGame: React.PropTypes.object,
    fetchCards: React.PropTypes.func,
    fetchPacks: React.PropTypes.func,
    gameSocketConnectError: React.PropTypes.func,
    gameSocketConnected: React.PropTypes.func,
    gameSocketConnecting: React.PropTypes.func,
    gameSocketDisconnect: React.PropTypes.func,
    gameSocketReconnecting: React.PropTypes.func,
    games: React.PropTypes.array,
    loggedIn: React.PropTypes.bool,
    navigate: React.PropTypes.func,
    packs: React.PropTypes.array,
    path: React.PropTypes.string,
    receiveBannerNotice: React.PropTypes.func,
    receiveGameState: React.PropTypes.func,
    receiveGames: React.PropTypes.func,
    receiveJoinGame: React.PropTypes.func,
    receiveLobbyMessage: React.PropTypes.func,
    receiveLobbyMessages: React.PropTypes.func,
    receiveNewGame: React.PropTypes.func,
    receivePasswordError: React.PropTypes.func,
    receiveUsers: React.PropTypes.func,
    sendGameSocketConnectFailed: React.PropTypes.func,
    socketConnected: React.PropTypes.func,
    token: React.PropTypes.string,
    username: React.PropTypes.string
};

function mapStateToProps(state) {
    return {
        agendas: state.cards.agendas,
        cards: state.cards.cards,
        currentGame: state.games.currentGame,
        games: state.games.games,
        packs: state.cards.packs,
        path: state.navigation.path,
        loggedIn: state.auth.loggedIn,
        token: state.auth.token,
        username: state.auth.username
    };
}

const Application = connect(mapStateToProps, actions)(App);

export default Application;
