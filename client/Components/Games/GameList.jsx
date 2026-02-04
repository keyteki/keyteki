import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Trans, useTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import Avatar from '../Site/Avatar';
import AlertPanel from '../Site/AlertPanel';
import { lobbyActions } from '../../redux/slices/lobbySlice';
import TimeLimitIcon from '../../assets/img/Timelimit.png';
import ShowHandIcon from '../../assets/img/ShowHandIcon.png';
import SealedIcon from '../../assets/img/sealed.png';
import ReversalIcon from '../../assets/img/reversal.png';
import AdaptiveIcon from '../../assets/img/adaptive.png';
import AllianceIcon from '../../assets/img/alliance.png';
import UnchainedIcon from '../../assets/img/601.png';

import './GameList.scss';

const GameList = (props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { currentGame, socket, user } = useSelector((state) => ({
        currentGame: state.lobby.currentGame,
        socket: state.lobby.socket,
        user: state.account.user
    }));
    const canWatch = useCallback(
        (game) => {
            return !currentGame && (game.allowSpectators || user?.permissions?.canManageGames);
        },
        [currentGame, user]
    );

    const canJoin = useCallback(
        (game) => {
            if (currentGame || game.started || game.full) {
                return false;
            }

            return true;
        },
        [currentGame]
    );

    const joinGame = useCallback(
        (event, game) => {
            event.preventDefault();

            if (!user) {
                toast.error(t('Please login before trying to join a game'));
                return;
            }

            if (game.needsPassword) {
                dispatch(lobbyActions.joinPasswordGame({ game, joinType: 'Join' }));
            } else {
                socket.emit('joingame', game.id);
            }

            if (props.onJoinOrWatchClick) {
                props.onJoinOrWatchClick();
            }
        },
        [dispatch, props, socket, t, user]
    );

    const watchGame = useCallback(
        (event, game) => {
            event.preventDefault();

            if (!user) {
                toast.error(t('Please login before trying to watch a game'));
                return;
            }

            if (game.needsPassword) {
                dispatch(lobbyActions.joinPasswordGame({ game, joinType: 'Watch' }));
            } else {
                socket.emit('watchgame', game.id);
            }

            if (props.onJoinOrWatchClick) {
                props.onJoinOrWatchClick();
            }
        },
        [dispatch, props, socket, t, user]
    );

    const removeGame = useCallback(
        (event, game) => {
            event.preventDefault();
            socket.emit('removegame', game.id);
        },
        [socket]
    );

    const gameList = useMemo(() => {
        let groupedGames = {};
        let isAdmin = user && user.permissions.canManageGames;
        const games = props.games || [];
        const gameFilter = props.gameFilter || {};
        const getPlayerNameAndAvatar = (player, firstPlayer) => {
            const userClass =
                'username' + (player.role ? ` ${player.role.toLowerCase()}-role` : '');

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
        };
        const getPlayers = (game) => {
            let firstPlayer = true;
            let players = Object.values(game.players).map((player) => {
                const classes = classNames('game-player-row', {
                    'first-player': firstPlayer,
                    'other-player': !firstPlayer
                });

                const retPlayer = (
                    <div key={player.name} className={classes}>
                        <div>
                            {firstPlayer ? (
                                <div className='game-faction-row first-player'>
                                    {getPlayerNameAndAvatar(player, firstPlayer)}
                                </div>
                            ) : (
                                <div className='game-faction-row other-player'>
                                    {getPlayerNameAndAvatar(player, firstPlayer)}
                                </div>
                            )}
                        </div>
                    </div>
                );

                firstPlayer = false;

                return retPlayer;
            });

            if (players.length === 1) {
                if (canJoin(game)) {
                    players.push(
                        <div key={players[0].name} className={'game-player-row other-player'}>
                            <div className='game-faction-row other-player'>
                                <button
                                    className='btn btn-success gamelist-button img-fluid'
                                    onClick={(event) => joinGame(event, game)}
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
        };
        const getGamesForType = (gameType, gamesToProcess) => {
            let gamesToReturn = [];

            for (const game of gamesToProcess) {
                if (gameFilter.onlyShowNew && game.started) {
                    continue;
                }

                if (!gameFilter[game.gameFormat]) {
                    continue;
                }

                const players = getPlayers(game);

                const rowClass = classNames('game-row', {
                    [game.node]: game.node && isAdmin,
                    ['private-game']: game.gamePrivate && isAdmin
                });

                let timeDifference = moment().diff(moment(game.createdAt));
                if (timeDifference < 0) {
                    timeDifference = 0;
                }

                const formattedTime = moment.utc(timeDifference).format('HH:mm');

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
                                    {game.gameFormat === 'alliance' && (
                                        <img
                                            src={AllianceIcon}
                                            className='game-list-icon-no-invert'
                                            alt={t('Alliance game format')}
                                            title={t('Alliance game format')}
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
                                    {game.gameFormat === 'unchained' && (
                                        <img
                                            src={UnchainedIcon}
                                            className='game-list-icon'
                                            alt={t('Unchained game format')}
                                            title={t('Unchained game format')}
                                        />
                                    )}
                                </span>
                            </div>
                            <div className='game-middle-row'>{players}</div>
                            <div className='game-row-buttons'>
                                {canWatch(game) && (
                                    <button
                                        className='btn btn-primary gamelist-button'
                                        onClick={(event) => watchGame(event, game)}
                                    >
                                        <Trans>Watch</Trans>
                                    </button>
                                )}
                                {isAdmin && (
                                    <button
                                        className='btn btn-danger gamelist-button'
                                        onClick={(event) => removeGame(event, game)}
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
                <div key={gameType}>
                    <div className={gameHeaderClass}>
                        {t(gameType)} ({gamesToReturn.length})
                    </div>
                    {gamesToReturn}
                </div>
            );
        };

        for (const game of games) {
            if (!game.started && game.gamePrivate && !isAdmin) {
                continue;
            }

            if (!groupedGames[game.gameType]) {
                groupedGames[game.gameType] = [game];
            } else {
                groupedGames[game.gameType].push(game);
            }
        }

        let list = [];

        for (const gameType of ['beginner', 'casual', 'competitive']) {
            if (gameFilter[gameType] && groupedGames[gameType]) {
                list.push(getGamesForType(gameType, groupedGames[gameType]));
            }
        }

        return list;
    }, [
        canJoin,
        canWatch,
        joinGame,
        props.gameFilter,
        props.games,
        removeGame,
        t,
        user,
        watchGame
    ]);

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
};

GameList.displayName = 'GameList';
GameList.propTypes = {
    gameFilter: PropTypes.object,
    games: PropTypes.array,
    onJoinOrWatchClick: PropTypes.func,
    showNodes: PropTypes.bool
};

export default GameList;
