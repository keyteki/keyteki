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

import * as actions from './actions';

var notAuthedMenu = [
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' }
];

var authedMenu = [
    { name: 'Logout', path: '/logout' }
];

var leftMenu = [
    { name: 'Decks', path: '/decks' },
    { name: 'Play', path: '/play' }
];

class App extends React.Component {
    componentWillMount() {
        this.props.fetchCards();

        $(document).ajaxError((event, xhr) => {
            if(xhr.status === 401) {
                this.props.navigate('/login');
            }
        });

        var socket = io.connect(window.location.origin, { query: 'token=' + this.props.token });

        socket.on('connect', () => {
            this.props.socketConnected(socket);

            socket.on('games', data => {
                this.props.receiveGames(data);
            });

            socket.on('newgame', game => {
                this.props.receiveNewGame(game);
            });

            socket.on('joingame', game => {
                this.props.receiveJoinGame(game);
            });

            socket.on('updategame', game => {
                this.props.receiveUpdateGame(game);
            });

            socket.on('leavegame', (game, player) => {
                var isMe = false;

                if(player.name === this.props.username) {
                    isMe = true;
                }

                this.props.receiveLeaveGame(game, isMe);
            });

            socket.on('gamestate', (game) => {
                this.props.receiveGameState(game);
            });
        });
    }

    render() {
        var rightMenu = this.props.loggedIn ? authedMenu : notAuthedMenu;
        var component = {};
        
        var path = this.props.path;
        var pathArg = undefined;
        var index = path.indexOf('/decks/edit');

        if(index !== -1) {
            path = path.substr(index, 11);
            pathArg = this.props.path.substr(11 + 1);
        } 

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
                component = <Decks cards={this.props.cards} packs={this.props.packs} />;
                break;
            case '/decks/add':
                component = <AddDeck cards={this.props.cards} packs={this.props.packs} agendas={this.props.agendas} />;
                break;
            case '/decks/edit':
                component = <EditDeck cards={this.props.cards} packs={this.props.packs} agendas={this.props.agendas} deckId={pathArg} />;
                break;
            case '/play':
                component = this.props.currentGame && this.props.currentGame.started ? <GameBoard /> : <GameLobby games={this.props.games} />;
                break;
            default:
                component = <NotFound />;
                break;
        }

        return (<div>
            <NavBar leftMenu={leftMenu} rightMenu={rightMenu} title='Throneteki' currentPath={this.props.path} />
            <div className='container-fluid'>
                {component}
            </div>
        </div>);
    }
}

App.displayName = 'Application';
App.propTypes = {
    agendas: React.PropTypes.array,
    cards: React.PropTypes.array,
    currentGame: React.PropTypes.object,
    fetchCards: React.PropTypes.func,
    games: React.PropTypes.array,
    loggedIn: React.PropTypes.bool,
    navigate: React.PropTypes.func,
    packs: React.PropTypes.array,
    path: React.PropTypes.string,
    receiveGameState: React.PropTypes.func,
    receiveGames: React.PropTypes.func,
    receiveJoinGame: React.PropTypes.func,
    receiveLeaveGame: React.PropTypes.func,
    receiveNewGame: React.PropTypes.func,
    receiveUpdateGame: React.PropTypes.func,
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
