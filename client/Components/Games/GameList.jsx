import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import moment from 'moment';
import { withTranslation, Trans } from 'react-i18next';
import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import Avatar from '../Site/Avatar';
import AlertPanel from '../Site/AlertPanel';
import * as actions from '../../redux/actions';
import TimeLimitIcon from '../../assets/img/Timelimit.png';
import ShowHandIcon from '../../assets/img/ShowHandIcon.png';
import SealedIcon from '../../assets/img/sealed.png';
import ReversalIcon from '../../assets/img/reversal.png';
import AdaptiveIcon from '../../assets/img/adaptive.png';

import './GameList.scss';

class GameList extends React.Component {
    constructor(props) {
        super(props);

        this.joinGame = this.joinGame.bind(this);
    }

    joinGame(event, game) {
        let t = this.props.t;

        event.preventDefault();

        if (!this.props.user) {
            toastr.error(t('Error'), t('Please login before trying to join a game'));
            return;
        }

        if (game.needsPassword) {
            this.props.joinPasswordGame(game, 'Join');
        } else {
            this.props.socket.emit('joingame', game.id);
        }

        if (this.props.onJoinOrWatchClick) {
            this.props.onJoinOrWatchClick();
        }
    }

    canWatch(game) {
        return (
            !this.props.currentGame &&
            (game.allowSpectators || this.props.user?.permissions?.canManageGames)
        );
    }

    watchGame(event, game) {
        let t = this.props.t;

        event.preventDefault();

        if (!this.props.user) {
            toastr.error(t('Error'), t('Please login before trying to watch a game'));
            return;
        }

        if (game.needsPassword) {
            this.props.joinPasswordGame(game, 'Watch');
        } else {
            this.props.socket.emit('watchgame', game.id);
        }

        if (this.props.onJoinOrWatchClick) {
            this.props.onJoinOrWatchClick();
        }
    }

    removeGame(event, game) {
        event.preventDefault();

        this.props.socket.emit('removegame', game.id);
    }

    canJoin(game) {
        if (this.props.currentGame || game.started || game.full) {
            return false;
        }

        return true;
    }

    getPlayerCards(player, firstPlayer) {
        if (firstPlayer) {
            return (
                <div className='game-faction-row first-player'>
                    {this.getPlayerNameAndAvatar(player, firstPlayer)}
                </div>
            );
        }

        return (
            <div className='game-faction-row other-player'>
                {this.getPlayerNameAndAvatar(player, firstPlayer)}
            </div>
        );
    }

    getPlayerNameAndAvatar(player, firstPlayer) {
        let userClass = 'username' + (player.role ? ` ${player.role.toLowerCase()}-role` : '');

        if (firstPlayer) {
            return (
                <div className='game-player-name'>
                    <span className='gamelist-avatar'>
                        <Avatar imgPath={player.avatar} />
                    </span>
                    <span className={userClass}>{player.name}</span>
                </div>
            );
        }

        return (
            <div className='game-player-name'>
                <span className={userClass}>{player.name}</span>
                <span className='gamelist-avatar'>
                    <Avatar imgPath={player.avatar} />
                </span>
            </div>
        );
    }

    getPlayers(game) {
        let firstPlayer = true;
        let players = Object.values(game.players).map((player) => {
            let classes = classNames('game-player-row', {
                'first-player': firstPlayer,
                'other-player': !firstPlayer
            });

            let retPlayer = (
                <div key={player.name} className={classes}>
                    <div>{this.getPlayerCards(player, firstPlayer)}</div>
                </div>
            );

            firstPlayer = false;

            return retPlayer;
        });

        if (players.length === 1) {
            if (this.canJoin(game)) {
                players.push(
                    <div key={players[0].name} className={'game-player-row other-player'}>
                        <div className='game-faction-row other-player'>
                            <button
                                className='btn btn-success gamelist-button img-fluid'
                                onClick={(event) => this.joinGame(event, game)}
                            >
                                <Trans>Join</Trans>
                            </button>
                        </div>
                    </div>
                );
            } else {
                players.push(
                    <div key={players[0].name} className='game-faction-row other-player' />
                );
            }
        }

        return players;
    }

    getGamesForType(gameType, games) {
        let gamesToReturn = [];
        let t = this.props.t;

        for (const game of games) {
            if (this.props.gameFilter.onlyShowNew && game.started) {
                continue;
            }

            if (!this.props.gameFilter[game.gameFormat]) {
                continue;
            }

            let players = this.getPlayers(game);

            let isAdmin = this.props.user && this.props.user.permissions.canManageGames;
            let rowClass = classNames('game-row', {
                [game.node]: game.node && isAdmin,
                ['private-game']: game.gamePrivate && isAdmin
            });

            let timeDifference = moment().diff(moment(game.createdAt));
            if (timeDifference < 0) {
                timeDifference = 0;
            }

            let formattedTime = moment.utc(timeDifference).format('HH:mm');

            gamesToReturn.push(
                <div key={game.id}>
                    <hr />
                    <div className={rowClass}>
                        <div className='game-header-row'>
                            <span className='game-title'>
                                <b>{game.name}</b>
                            </span>
                            <span className='game-time'>{`[${formattedTime}]`}</span>
                            <span className='game-icons'>
                                {game.showHand && (
                                    <img
                                        src={ShowHandIcon}
                                        className='game-list-icon'
                                        alt={t('Show hands to spectators')}
                                        title={t('Show hands to spectators')}
                                    />
                                )}
                                {game.needsPassword && <FontAwesomeIcon icon={faLock} />}
                                {game.useGameTimeLimit && (
                                    <img
                                        src={TimeLimitIcon}
                                        className='game-list-icon'
                                        alt={t('Time limit used')}
                                    />
                                )}
                                {game.gameFormat === 'sealed' && (
                                    <img
                                        src={SealedIcon}
                                        className='game-list-icon'
                                        alt={t('Sealed game format')}
                                        title={t('Sealed game format')}
                                    />
                                )}
                                {game.gameFormat === 'reversal' && (
                                    <img
                                        src={ReversalIcon}
                                        className='game-list-icon'
                                        alt={t('Reversal game format')}
                                        title={t('Reversal game format')}
                                    />
                                )}
                                {game.gameFormat === 'adaptive-bo1' && (
                                    <img
                                        src={AdaptiveIcon}
                                        className='game-list-icon'
                                        alt={t('Adaptive (Best of 1) game format')}
                                        title={t('Adaptive (Best of 1) game format')}
                                    />
                                )}
                            </span>
                        </div>
                        <div className='game-middle-row'>{players}</div>
                        <div className='game-row-buttons'>
                            {this.canWatch(game) && (
                                <button
                                    className='btn btn-primary gamelist-button'
                                    onClick={(event) => this.watchGame(event, game)}
                                >
                                    <Trans>Watch</Trans>
                                </button>
                            )}
                            {isAdmin && (
                                <button
                                    className='btn btn-danger gamelist-button'
                                    onClick={(event) => this.removeGame(event, game)}
                                >
                                    <Trans>Remove</Trans>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        let gameHeaderClass = 'game-header';
        switch (gameType) {
            case 'beginner':
                gameHeaderClass += ' badge-success';
                break;
            case 'casual':
                gameHeaderClass += ' badge-warning';
                break;
            case 'competitive':
                gameHeaderClass += ' badge-danger';
                break;
        }

        return (
            <div>
                <div className={gameHeaderClass}>
                    {t(gameType)} ({gamesToReturn.length})
                </div>
                {gamesToReturn}
            </div>
        );
    }

    render() {
        let groupedGames = {};
        let t = this.props.t;

        for (const game of this.props.games) {
            if (!groupedGames[game.gameType]) {
                groupedGames[game.gameType] = [game];
            } else {
                groupedGames[game.gameType].push(game);
            }
        }

        let gameList = [];

        for (const gameType of ['beginner', 'casual', 'competitive']) {
            if (this.props.gameFilter[gameType] && groupedGames[gameType]) {
                gameList.push(this.getGamesForType(gameType, groupedGames[gameType]));
            }
        }

        if (gameList.length === 0) {
            return (
                <Col className='game-list' xs='12'>
                    <AlertPanel
                        type='info'
                        message={t('There are no games matching the filters you have selected')}
                    />
                </Col>
            );
        }

        return (
            <Col className='game-list' xs='12'>
                {gameList}
            </Col>
        );
    }
}

GameList.displayName = 'GameList';
GameList.propTypes = {
    currentGame: PropTypes.object,
    gameFilter: PropTypes.object,
    games: PropTypes.array,
    i18n: PropTypes.object,
    joinPasswordGame: PropTypes.func,
    onJoinOrWatchClick: PropTypes.func,
    showNodes: PropTypes.bool,
    socket: PropTypes.object,
    t: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(GameList));
