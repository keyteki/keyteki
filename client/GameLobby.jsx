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
        this.onShowNodesChecked = this.onShowNodesChecked.bind(this);

        this.state = {
            newGame: false,
            showNodes: false
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

    onShowNodesChecked() {
        this.setState({ showNodes: !this.state.showNodes });
    }

    render() {
        return (
            <div>
                { this.props.bannerNotice ? <div className='alert alert-danger'>{this.props.bannerNotice}</div> : null }

                <div className='col-sm-7'>
                    <button className='btn btn-primary' onClick={this.onNewGameClick} disabled={!!this.props.currentGame}>New Game</button>
                    {this.props.isAdmin ? <span className='pull-right'><input type='checkbox' checked={this.state.showNodes} onChange={this.onShowNodesChecked} />Show Nodes</span> : null}
                    {this.props.games.length === 0 ? <h4>No games are currently in progress</h4> : <GameList games={this.props.games} showNodes={this.state.showNodes} />}
                </div>
                <div className='col-sm-5'>
                    {(!this.props.currentGame && this.props.newGame) ? <NewGame defaultGameName={this.props.username + '\'s game'} /> : null}
                    {this.props.currentGame ? <PendingGame /> : null}
                </div>
            </div>);
    }
}

InnerGameLobby.displayName = 'GameLobby';
InnerGameLobby.propTypes = {
    bannerNotice: React.PropTypes.string,
    currentGame: React.PropTypes.object,
    games: React.PropTypes.array,
    isAdmin: React.PropTypes.bool,
    newGame: React.PropTypes.bool,
    setContextMenu: React.PropTypes.func,
    startNewGame: React.PropTypes.func,
    username: React.PropTypes.string
};

function mapStateToProps(state) {
    return {
        bannerNotice: state.chat.notice,
        currentGame: state.games.currentGame,
        isAdmin: state.auth.isAdmin,
        games: state.games.games,
        newGame: state.games.newGame,
        socket: state.socket.socket,
        username: state.auth.username
    };
}

const GameLobby = connect(mapStateToProps, actions)(InnerGameLobby);

export default GameLobby;

