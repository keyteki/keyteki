import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import moment from 'moment';

import Avatar from '../Site/Avatar';
import AlertPanel from '../Site/AlertPanel';
import * as actions from '../../actions';

class GameList extends React.Component {
    constructor() {
        super();

        this.joinGame = this.joinGame.bind(this);
    }

    joinGame(event, game) {
        event.preventDefault();

        if(!this.props.user) {
            toastr.error('Please login before trying to join a game');
            return;
        }

        if(game.needsPassword) {
            this.props.joinPasswordGame(game, 'Join');
        } else {
            this.props.socket.emit('joingame', game.id);
        }
    }

    canWatch(game) {
        return !this.props.currentGame && game.allowSpectators;
    }

    watchGame(event, game) {
        event.preventDefault();

        if(!this.props.user) {
            toastr.error('Please login before trying to watch a game');
            return;
        }

        if(game.needsPassword) {
            this.props.joinPasswordGame(game, 'Watch');
        } else {
            this.props.socket.emit('watchgame', game.id);
        }
    }

    removeGame(event, game) {
        event.preventDefault();

        this.props.socket.emit('removegame', game.id);
    }

    canJoin(game) {
        if(this.props.currentGame || game.started || game.full) {
            return false;
        }

        return true;
    }

    getPlayerCards(player, firstPlayer) {
        let houses = player.houses && player.houses.map(house => {
            return <img key={ house } className='img-responsive' src={ `/img/house/${house}.png` } />;
        });

        if(firstPlayer) {
            return (<div className='game-faction-row first-player'>
                { this.getPlayerNameAndAvatar(player, firstPlayer) }
                { houses }
            </div>);
        }

        return (<div className='game-faction-row other-player'>
            { houses }
            { this.getPlayerNameAndAvatar(player, firstPlayer) }
        </div>);
    }

    getPlayerNameAndAvatar(player, firstPlayer) {
        if(firstPlayer) {
            return (<div className='game-player-name'>
                <span className='gamelist-avatar'><Avatar username={ player.name } /></span>
                <span className='bold'>{ player.name }</span>
            </div>);
        }

        return (<div className='game-player-name'>
            <span className='bold'>{ player.name }</span>
            <span className='gamelist-avatar'><Avatar username={ player.name } /></span>
        </div>);
    }

    getPlayers(game) {
        let firstPlayer = true;
        let players = Object.values(game.players).map(player => {
            let classes = classNames('game-player-row', {
                'first-player': firstPlayer,
                'other-player': !firstPlayer
            });

            let retPlayer = (<div key={ player.name } className={ classes }>
                <div>
                    { this.getPlayerCards(player, firstPlayer) }
                </div>
            </div>);

            firstPlayer = false;

            return retPlayer;
        });

        if(players.length === 1) {
            if(this.canJoin(game)) {
                players.push(
                    <div key={ players[0].name } className={ 'game-player-row other-player' }>
                        <div className='game-faction-row other-player'>
                            <button className='btn btn-primary gamelist-button img-responsive' onClick={ event => this.joinGame(event, game) }>Join</button>
                        </div>
                    </div>);
            } else {
                players.push(<div key={ players[0].name } className='game-faction-row other-player' />);
            }
        }

        return players;
    }

    getGamesForType(gameType, games) {
        let gamesToReturn = [];

        for(const game of games) {
            if(this.props.gameFilter.showOnlyNewGames && game.started) {
                continue;
            }

            if(!this.props.gameFilter[game.gameFormat]) {
                continue;
            }

            let players = this.getPlayers(game);

            let isAdmin = this.props.user && this.props.user.permissions.canManageGames;
            let rowClass = classNames('game-row', {
                [game.node]: game.node && isAdmin
            });

            let timeDifference = moment().diff(moment(game.createdAt));
            if(timeDifference < 0) {
                timeDifference = 0;
            }

            let formattedTime = moment.utc(timeDifference).format('HH:mm');

            gamesToReturn.push((
                <div key={ game.id }>
                    <hr />
                    <div className={ rowClass }>
                        <div className='game-header-row'>
                            <span className='game-title'>
                                <b>{ game.name }</b>
                            </span>
                            <span className='game-time'>{ `[${formattedTime}]` }</span>
                            <span className='game-icons'>
                                { game.showHand && <img src='/img/ShowHandIcon.png' className='game-list-icon' alt='Show hands to spectators' title='Show hands to spectators' /> }
                                { game.needsPassword && <span className='password-game glyphicon glyphicon-lock' /> }
                                { game.gameFormat === 'sealed' && <img src='/img/sealed.png' className='game-list-icon' alt='Sealed game format' title='Sealed game format' /> }
                            </span>
                        </div>
                        <div className='game-middle-row'>
                            { players }
                        </div>
                        <div className='game-row-buttons'>
                            { this.canWatch(game) &&
                                <button className='btn btn-primary gamelist-button' onClick={ event => this.watchGame(event, game) }>Watch</button> }
                            { isAdmin && <button className='btn btn-primary gamelist-button' onClick={ event => this.removeGame(event, game) }>Remove</button> }
                        </div>
                    </div>
                </div>
            ));
        }

        let gameHeaderClass = 'game-header bold';
        switch(gameType) {
            case 'beginner':
                gameHeaderClass += ' label-success';
                break;
            case 'casual':
                gameHeaderClass += ' label-warning';
                break;
            case 'competitive':
                gameHeaderClass += ' label-danger';
                break;
        }

        return (
            <div>
                <div className={ gameHeaderClass }>{ gameType } ({ gamesToReturn.length })
                </div>
                { gamesToReturn }
            </div>);
    }

    render() {
        let groupedGames = {};

        for(const game of this.props.games) {
            if(!groupedGames[game.gameType]) {
                groupedGames[game.gameType] = [game];
            } else {
                groupedGames[game.gameType].push(game);
            }
        }

        let gameList = [];

        for(const gameType of ['beginner', 'casual', 'competitive']) {
            if(this.props.gameFilter[gameType] && groupedGames[gameType]) {
                gameList.push(this.getGamesForType(gameType, groupedGames[gameType]));
            }
        }

        if(gameList.length === 0) {
            return (<div className='game-list col-xs-12'>
                <AlertPanel type='info' message='There are no games matching the filters you have selected' />
            </div>);
        }

        return (
            <div className='game-list col-xs-12'>
                { gameList }
            </div>);
    }
}

GameList.displayName = 'GameList';
GameList.propTypes = {
    currentGame: PropTypes.object,
    gameFilter: PropTypes.object,
    games: PropTypes.array,
    joinPasswordGame: PropTypes.func,
    showNodes: PropTypes.bool,
    socket: PropTypes.object,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(GameList);
