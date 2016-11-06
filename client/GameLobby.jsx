import React from 'react';
import { connect } from 'react-redux';

import NewGame from './NewGame.jsx';
import GameList from './GameList.jsx';
import PendingGame from './PendingGame.jsx';

import * as actions from './actions';

class InnerGameLobby extends React.Component {
    constructor() {
        super();

        this.onNewGameClick = this.onNewGameClick.bind(this);

        this.state = {
            newGame: false
        };
    }

    componentWillReceiveProps(props) {
        if(!props.currentGame) {
            this.props.setContextMenu([]);
        }
    }

    onNewGameClick(event) {
        event.preventDefault();

        this.props.startNewGame();
    }

    render() {
        return (
            <div>
                <div className='col-sm-6'>
                    <button className='btn btn-primary' onClick={this.onNewGameClick} disabled={!!this.props.currentGame}>New Game</button>
                    {this.props.games.length === 0 ? <h4>No games are currently in progress</h4> : <GameList games={this.props.games} />}
                </div>
                <div className='col-sm-6'>
                    {this.props.newGame ? <NewGame defaultGameName={this.props.username + '\'s game'} /> : null}
                    {this.props.currentGame ? <PendingGame /> : null}
                </div>
            </div>);
    }
}

InnerGameLobby.displayName = 'GameLobby';
InnerGameLobby.propTypes = {
    currentGame: React.PropTypes.object,
    games: React.PropTypes.array,
    newGame: React.PropTypes.bool,
    setContextMenu: React.PropTypes.func,
    startNewGame: React.PropTypes.func,
    username: React.PropTypes.string
};

function mapStateToProps(state) {
    return {
        currentGame: state.games.currentGame,
        newGame: state.games.newGame,
        socket: state.socket.socket,
        username: state.auth.username
    };
}

const GameLobby = connect(mapStateToProps, actions)(InnerGameLobby);

export default GameLobby;

