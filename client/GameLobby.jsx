import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NewGame from './NewGame.jsx';
import GameList from './GameList.jsx';
import PendingGame from './PendingGame.jsx';
import PasswordGame from './PasswordGame.jsx';
import AlertPanel from './SiteComponents/AlertPanel.jsx';

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

        if(props.username) {
            this.setState({ errorMessage: undefined });
        }
    }

    onNewGameClick(event) {
        event.preventDefault();

        if(!this.props.username) {
            this.setState({ errorMessage: 'Please login before trying to start a new game' });

            return;
        }

        this.props.startNewGame();
    }

    render() {
        var rightside = null;

        if(this.props.passwordGame) {
            rightside = <PasswordGame />;
        } else if(this.props.currentGame) {
            rightside = <PendingGame />;
        }

        return (
            <div className='full-height'>
                { this.props.bannerNotice ? <AlertPanel type='error' message={ this.props.bannerNotice } /> : null }
                { this.state.errorMessage ? <AlertPanel type='error' message={ this.state.errorMessage } /> : null }

                <div className='col-sm-7 full-height'>
                    <div className='panel-title text-center'>
                        Current Games
                    </div>
                    <div className='panel game-list-container'>
                        <button className='btn btn-primary' onClick={ this.onNewGameClick } disabled={ !!this.props.currentGame }>New Game</button>
                        { this.props.games.length === 0 ? <h4>No games are currently in progress</h4> : <GameList games={ this.props.games } /> }
                    </div>
                </div>
                <div className='col-sm-5'>
                    { (!this.props.currentGame && this.props.newGame) ? <NewGame defaultGameName={ this.props.username + '\'s game' } /> : null }
                    { rightside }
                </div>
            </div>);
    }
}

InnerGameLobby.displayName = 'GameLobby';
InnerGameLobby.propTypes = {
    bannerNotice: PropTypes.string,
    currentGame: PropTypes.object,
    games: PropTypes.array,
    isAdmin: PropTypes.bool,
    newGame: PropTypes.bool,
    passwordGame: PropTypes.object,
    setContextMenu: PropTypes.func,
    startNewGame: PropTypes.func,
    username: PropTypes.string
};

function mapStateToProps(state) {
    return {
        bannerNotice: state.chat.notice,
        currentGame: state.games.currentGame,
        isAdmin: state.auth.isAdmin,
        games: state.games.games,
        newGame: state.games.newGame,
        passwordGame: state.games.passwordGame,
        socket: state.socket.socket,
        username: state.auth.username
    };
}

const GameLobby = connect(mapStateToProps, actions)(InnerGameLobby);

export default GameLobby;
