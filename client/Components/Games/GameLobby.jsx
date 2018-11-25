import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery';

import NewGame from './NewGame';
import GameList from './GameList';
import PendingGame from './PendingGame';
import PasswordGame from './PasswordGame';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import Modal from '../Site/Modal';
import Checkbox from '../Form/Checkbox';

import * as actions from '../../actions';

const GameState = Object.freeze({
    None: 0,
    NewGame: 1,
    PendingGame: 2,
    PasswordedGame: 3,
    Started: 4
});

class GameLobby extends React.Component {
    constructor(props) {
        super(props);

        this.onNewGameClick = this.onNewGameClick.bind(this);
        this.onQuickJoinClick = this.onQuickJoinClick.bind(this);
        this.onModalHidden = this.onModalHidden.bind(this);

        let savedFilter = localStorage.getItem('gameFilter');
        if(savedFilter) {
            savedFilter = JSON.parse(savedFilter);
        } else {
            savedFilter = {};
        }

        let filterDefaults = {
            beginner: true,
            casual: true,
            competitive: true,
            showOnlyNewGames: false
        };

        this.state = {
            gameState: GameState.None,
            filter: Object.assign(filterDefaults, savedFilter)
        };
    }

    componentDidMount() {
        $('#pendingGameModal').on('hide.bs.modal', this.onModalHidden);

        if(window.Notification && Notification.permission !== 'granted') {
            Notification.requestPermission((status) => {
                if(Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
    }

    componentWillReceiveProps(props) {
        if(!props.currentGame) {
            this.props.setContextMenu([]);
        }

        if(props.user) {
            this.setState({ errorMessage: undefined });
        }

        this.setGameState(props);

        if(!this.isPendingGameStillCurrent(props) || this.isGameInProgress(props)) {
            this.setState({ gameState: props.currentGame && props.currentGame.started ? GameState.Started : GameState.None }, () => {
                $('#pendingGameModal').modal('hide');
            });
        } else if(!this.isPasswordGameStillCurrent(props) && !props.currentGame) {
            $('#pendingGameModal').modal('hide');
        } else if(!this.props.passwordGame && props.passwordGame) {
            $('#pendingGameModal').modal('show');
        }

        if(props.currentGame && !this.props.currentGame) {
            // Joining a game
            $('#pendingGameModal').modal('show');
            this.setState({ gameState: GameState.PendingGame });
        }
    }

    setGameState(props) {
        if(props.passwordGame) {
            this.setState({ gameState: GameState.PasswordedGame });
        } else if(props.currentGame && !props.currentGame.started) {
            this.setState({ gameState: GameState.PendingGame });
        } else if(props.currentGame && props.currentGame.started) {
            this.setState({ gameState: GameState.Started });
        } else if(!props.currentGame && props.newGame && props.user) {
            this.setState({ gameState: GameState.NewGame });
        }
    }

    isPendingGameStillCurrent(props) {
        if(this.props.newGame && !props.newGame) {
            return false;
        }

        if(this.props.currentGame && !props.currentGame) {
            return false;
        }

        return true;
    }

    isPasswordGameStillCurrent(props) {
        if(this.props.passwordGame && !props.passwordGame) {
            return false;
        }

        return true;
    }

    isGameInProgress(props) {
        if(props.currentGame && props.currentGame.started && (!this.props.currentGame || !this.props.currentGame.started)) {
            return true;
        }

        return false;
    }

    startNewGame() {
        if(!this.props.user) {
            this.setState({ errorMessage: 'Please login before trying to start a new game' });

            return;
        }

        $('#pendingGameModal').modal('show');

        this.props.startNewGame();
    }

    onNewGameClick(event) {
        event.preventDefault();

        this.setState({ quickJoin: false });

        this.startNewGame();
    }

    onQuickJoinClick(event) {
        event.preventDefault();

        this.setState({ quickJoin: true });

        this.startNewGame();
    }

    onModalHidden(event) {
        if($(event.target).attr('id') !== 'pendingGameModal') {
            return;
        }

        switch(this.state.gameState) {
            case GameState.NewGame:
                this.props.cancelNewGame();
                break;
            case GameState.PasswordedGame:
                this.props.cancelPasswordJoin();
                break;
            case GameState.PendingGame:
                if(!this.props.currentGame.started) {
                    this.props.leaveGame(this.props.currentGame.id);
                }
                break;
        }

        this.setGameState(this.props);
    }

    onCheckboxChange(field, event) {
        let filter = Object.assign({}, this.state.filter);

        filter[field] = event.target.checked;

        this.setState({ filter: filter });

        localStorage.setItem('gameFilter', JSON.stringify(filter));
    }

    render() {
        let modalProps = {
            id: 'pendingGameModal',
            className: 'settings-popup row',
            bodyClassName: 'col-xs-12',
            title: ''
        };
        let modalBody = null;

        switch(this.state.gameState) {
            case GameState.None:
            default:
                break;
            case GameState.NewGame:
                modalProps.title = 'Game Options';
                modalProps.okButton = 'Create';
                modalBody = <NewGame defaultGameName={ this.props.user.username + '\'s game' } quickJoin={ this.state.quickJoin } />;
                break;
            case GameState.PendingGame:
                modalProps.title = this.props.currentGame ? this.props.currentGame.name : '';
                modalBody = this.props.currentGame ? <PendingGame /> : null;
                break;
            case GameState.PasswordedGame:
                modalProps.title = 'Password Required';
                modalBody = <PasswordGame />;
                break;
        }

        return (
            <div className='full-height'>
                { this.props.bannerNotice ? <AlertPanel type='error' message={ this.props.bannerNotice } /> : null }
                { this.state.errorMessage ? <AlertPanel type='error' message={ this.state.errorMessage } /> : null }

                <div className='col-md-offset-2 col-md-8 full-height'>
                    <Panel title='Current Games'>
                        <div className='col-xs-12 game-controls'>
                            <div className='col-sm-3 join-buttons'>
                                <button className='btn btn-primary' onClick={ this.onNewGameClick } disabled={ !!this.props.currentGame }>New Game</button>
                                <button className='btn btn-primary' onClick={ this.onQuickJoinClick } disabled={ !!this.props.currentGame }>Quick Join</button>
                            </div>
                            <div className='col-sm-9 game-filter'>
                                <Panel type='tertiary'>
                                    <Checkbox name='beginner' label='Beginner' fieldClass='col-sm-4' noGroup onChange={ this.onCheckboxChange.bind(this, 'beginner') } checked={ this.state.filter['beginner'] } />
                                    <Checkbox name='casual' label='Casual' fieldClass='col-sm-4' noGroup onChange={ this.onCheckboxChange.bind(this, 'casual') } checked={ this.state.filter['casual'] } />
                                    <Checkbox name='competitive' label='Competitive' fieldClass='col-sm-4' noGroup onChange={ this.onCheckboxChange.bind(this, 'competitive') } checked={ this.state.filter['competitive'] } />
                                    <Checkbox name='showOnlyNewGames' label='Only show new games' fieldClass='col-sm-6' noGroup onChange={ this.onCheckboxChange.bind(this, 'showOnlyNewGames') } checked={ this.state.filter['showOnlyNewGames'] } />
                                </Panel>
                            </div>
                        </div>
                        <div className='col-xs-12'>
                            { this.props.games.length === 0 ? <AlertPanel type='info' message='No games are currently in progress.' /> : <GameList games={ this.props.games } gameFilter={ this.state.filter } /> }
                        </div>
                    </Panel>
                </div>
                <Modal { ...modalProps }>
                    { modalBody }
                </Modal>
            </div >);
    }
}

GameLobby.displayName = 'GameLobby';
GameLobby.propTypes = {
    bannerNotice: PropTypes.string,
    cancelNewGame: PropTypes.func,
    cancelPasswordJoin: PropTypes.func,
    currentGame: PropTypes.object,
    games: PropTypes.array,
    leaveGame: PropTypes.func,
    newGame: PropTypes.bool,
    passwordGame: PropTypes.object,
    setContextMenu: PropTypes.func,
    startNewGame: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        bannerNotice: state.lobby.notice,
        currentGame: state.lobby.currentGame,
        games: state.lobby.games,
        newGame: state.lobby.newGame,
        passwordGame: state.lobby.passwordGame,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(GameLobby);

