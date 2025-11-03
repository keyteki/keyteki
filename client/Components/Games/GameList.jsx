import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import moment from 'moment';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import Button from '../HeroUI/Button';

import Avatar from '../Site/Avatar';
import AlertPanel from '../Site/AlertPanel';
import { joinPasswordGame } from '../../redux/slices/lobbySlice';
import TimeLimitIcon from '../../assets/img/Timelimit.png';
import ShowHandIcon from '../../assets/img/ShowHandIcon.png';
import SealedIcon from '../../assets/img/sealed.png';
import ReversalIcon from '../../assets/img/reversal.png';
import AdaptiveIcon from '../../assets/img/adaptive.png';
import AllianceIcon from '../../assets/img/alliance.png';
import UnchainedIcon from '../../assets/img/601.png';

const GameList = ({ games, gameFilter, onJoinOrWatchClick }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { currentGame, socket, user } = useSelector((state) => ({
        currentGame: state.lobby.currentGame,
        socket: state.lobby.socket,
        user: state.account.user
    }));

    const joinGame = useCallback(
        (event, game) => {
            event.preventDefault();

            if (!user) {
                toastr.error(t('Error'), t('Please login before trying to join a game'));
                return;
            }

            if (game.needsPassword) {
                dispatch(joinPasswordGame(game, 'Join'));
            } else {
                socket.emit('joingame', game.id);
            }

            if (onJoinOrWatchClick) {
                onJoinOrWatchClick();
            }
        },
        [user, socket, onJoinOrWatchClick, dispatch, t]
    );

    const canWatch = useCallback(
        (game) => {
            return !currentGame && (game.allowSpectators || user?.permissions?.canManageGames);
        },
        [currentGame, user]
    );

    const watchGame = useCallback(
        (event, game) => {
            event.preventDefault();

            if (!user) {
                toastr.error(t('Error'), t('Please login before trying to watch a game'));
                return;
            }

            if (game.needsPassword) {
                dispatch(joinPasswordGame(game, 'Watch'));
            } else {
                socket.emit('watchgame', game.id);
            }

            if (onJoinOrWatchClick) {
                onJoinOrWatchClick();
            }
        },
        [user, socket, onJoinOrWatchClick, dispatch, t]
    );

    const removeGame = useCallback(
        (event, game) => {
            event.preventDefault();
            socket.emit('removegame', game.id);
        },
        [socket]
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

    const getPlayerCards = useCallback(
        (player, firstPlayer) => {
            const base = 'flex items-center flex-1 flex-col';
            const side = firstPlayer ? 'mr-2.5 items-end' : 'ml-2.5 items-start';
            return (
                <div className={`${base} ${side}`}>
                    {getPlayerNameAndAvatar(player, firstPlayer)}
                </div>
            );
        },
        [getPlayerNameAndAvatar]
    );

    const getPlayerNameAndAvatar = useCallback((player, firstPlayer) => {
        const nameClass = 'text-base font-medium';
        if (firstPlayer) {
            return (
                <div className='flex items-center text-base'>
                    <span className='inline-block ml-1 mr-1'>
                        <Avatar imgPath={player.avatar} />
                    </span>
                    <span className={nameClass}>{player.name}</span>
                </div>
            );
        }

        return (
            <div className='flex items-center text-base'>
                <span className={nameClass}>{player.name}</span>
                <span className='inline-block ml-1 mr-1'>
                    <Avatar imgPath={player.avatar} />
                </span>
            </div>
        );
    }, []);

    const getPlayers = useCallback(
        (game) => {
            let firstPlayer = true;
            let players = Object.values(game.players).map((player) => {
                const classes = classNames(
                    'flex flex-col flex-1',
                    firstPlayer ? 'mr-2.5 items-end' : 'ml-2.5 items-start'
                );

                let retPlayer = (
                    <div key={player.name} className={classes}>
                        <div>{getPlayerCards(player, firstPlayer)}</div>
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
                                <Button
                                    color='success'
                                    className='gamelist-button img-fluid'
                                    onPress={(event) => joinGame(event, game)}
                                >
                                    <Trans>Join</Trans>
                                </Button>
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
        },
        [getPlayerCards, canJoin, joinGame]
    );

    const getGamesForType = useCallback(
        (gameType, gamesToShow) => {
            let gamesToReturn = [];
            let isAdmin = user && user.permissions.canManageGames;

            for (const game of gamesToShow) {
                if (gameFilter.onlyShowNew && game.started) {
                    continue;
                }

                if (!gameFilter[game.gameFormat]) {
                    continue;
                }

                let players = getPlayers(game);

                const nodeBg =
                    isAdmin && game.node === 'node1'
                        ? 'bg-amber-500/20'
                        : isAdmin && game.node === 'node2'
                        ? 'bg-rose-500/20'
                        : '';
                let rowClass = classNames(
                    'min-h-32 p-2.5 border border-transparent hover:border-sky-500 hover:bg-sky-500/20 transition-colors',
                    nodeBg
                );

                let timeDifference = moment().diff(moment(game.createdAt));
                if (timeDifference < 0) {
                    timeDifference = 0;
                }

                let formattedTime = moment.utc(timeDifference).format('HH:mm');

                gamesToReturn.push(
                    <div key={game.id}>
                        <hr className='border-slate-600 m-0' />
                        <div className={rowClass}>
                            <div className='text-center text-base flex items-center justify-center gap-2 flex-wrap'>
                                <span className='font-semibold'>{game.name}</span>
                                <span className='opacity-75'>{`[${formattedTime}]`}</span>
                                <span className='inline-flex items-center gap-1'>
                                    {game.showHand && (
                                        <img
                                            src={ShowHandIcon}
                                            className='h-6 w-6 invert'
                                            alt={t('Show hands to spectators')}
                                            title={t('Show hands to spectators')}
                                        />
                                    )}
                                    {game.needsPassword && <FontAwesomeIcon icon={faLock} />}
                                    {game.useGameTimeLimit && (
                                        <img
                                            src={TimeLimitIcon}
                                            className='h-6 w-6 invert'
                                            alt={t('Time limit used')}
                                        />
                                    )}
                                    {game.gameFormat === 'sealed' && (
                                        <img
                                            src={SealedIcon}
                                            className='h-6 w-6 invert'
                                            alt={t('Sealed game format')}
                                            title={t('Sealed game format')}
                                        />
                                    )}
                                    {game.gameFormat === 'alliance' && (
                                        <img
                                            src={AllianceIcon}
                                            className='h-6 w-6'
                                            alt={t('Alliance game format')}
                                            title={t('Alliance game format')}
                                        />
                                    )}
                                    {game.gameFormat === 'reversal' && (
                                        <img
                                            src={ReversalIcon}
                                            className='h-6 w-6 invert'
                                            alt={t('Reversal game format')}
                                            title={t('Reversal game format')}
                                        />
                                    )}
                                    {game.gameFormat === 'adaptive-bo1' && (
                                        <img
                                            src={AdaptiveIcon}
                                            className='h-6 w-6 invert'
                                            alt={t('Adaptive (Best of 1) game format')}
                                            title={t('Adaptive (Best of 1) game format')}
                                        />
                                    )}
                                    {game.gameFormat === 'unchained' && (
                                        <img
                                            src={UnchainedIcon}
                                            className='h-6 w-6 invert'
                                            alt={t('Unchained game format')}
                                            title={t('Unchained game format')}
                                        />
                                    )}
                                </span>
                            </div>
                            <div className='mt-2.5 mb-2.5 flex justify-center items-center'>
                                {players}
                            </div>
                            <div className='text-center'>
                                {canWatch(game) && (
                                    <Button
                                        color='primary'
                                        className='gamelist-button'
                                        onPress={(event) => watchGame(event, game)}
                                    >
                                        <Trans>Watch</Trans>
                                    </Button>
                                )}
                                {isAdmin && (
                                    <Button
                                        color='danger'
                                        className='gamelist-button'
                                        onPress={(event) => removeGame(event, game)}
                                    >
                                        <Trans>Remove</Trans>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }

            const headerClass = classNames(
                'px-2 py-1 text-center capitalize text-white',
                gameType === 'beginner'
                    ? 'bg-green-600'
                    : gameType === 'casual'
                    ? 'bg-amber-500'
                    : 'bg-rose-600'
            );

            return (
                <div key={gameType}>
                    <div className={headerClass}>
                        {t(gameType)} ({gamesToReturn.length})
                    </div>
                    {gamesToReturn}
                </div>
            );
        },
        [gameFilter, user, getPlayers, canWatch, watchGame, removeGame, t]
    );

    const gameList = useMemo(() => {
        let groupedGames = {};
        let isAdmin = user && user.permissions.canManageGames;

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

        let gameListToRender = [];

        for (const gameType of ['beginner', 'casual', 'competitive']) {
            if (gameFilter[gameType] && groupedGames[gameType]) {
                gameListToRender.push(getGamesForType(gameType, groupedGames[gameType]));
            }
        }

        return gameListToRender;
    }, [games, gameFilter, user, getGamesForType]);

    if (gameList.length === 0) {
        return (
            <div className='game-list w-full'>
                <AlertPanel
                    type='info'
                    message={t('There are no games matching the filters you have selected')}
                />
            </div>
        );
    }

    return <div className='game-list w-full'>{gameList}</div>;
};

GameList.displayName = 'GameList';
GameList.propTypes = {
    gameFilter: PropTypes.object,
    games: PropTypes.array,
    onJoinOrWatchClick: PropTypes.func
};

export default GameList;
