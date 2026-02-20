import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, toast } from '@heroui/react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Icon from '../Icon';
import { faLock, faTrash } from '@fortawesome/free-solid-svg-icons';

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

const formatIconEntries = [
    ['showHand', { src: ShowHandIcon, title: 'Show hands to spectators' }],
    ['useGameTimeLimit', { src: TimeLimitIcon, title: 'Time limit used' }],
    ['sealed', { src: SealedIcon, title: 'Sealed game format' }],
    ['alliance', { src: AllianceIcon, title: 'Alliance game format', noInvert: true }],
    ['reversal', { src: ReversalIcon, title: 'Reversal game format' }],
    ['adaptive-bo1', { src: AdaptiveIcon, title: 'Adaptive (Best of 1) game format' }],
    ['unchained', { src: UnchainedIcon, title: 'Unchained game format' }]
];

const typeBadgeClass = {
    beginner:
        'bg-emerald-500/12 text-emerald-700 border-emerald-500/28 dark:bg-emerald-600/25 dark:text-emerald-300 dark:border-emerald-500/40',
    casual: 'bg-amber-500/12 text-amber-700 border-amber-500/28 dark:bg-amber-600/20 dark:text-amber-300 dark:border-amber-500/40',
    competitive:
        'bg-[color:color-mix(in_oklab,var(--brand-red)_12%,white)] text-[color:color-mix(in_oklab,var(--brand-red)_85%,black)] border-[color:color-mix(in_oklab,var(--brand-red)_35%,transparent)] dark:bg-rose-600/20 dark:text-rose-300 dark:border-rose-500/40'
};

const GameList = ({ gameFilter = {}, games = [], onJoinOrWatchClick }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { currentGame, socket, user } = useSelector((state) => ({
        currentGame: state.lobby.currentGame,
        socket: state.lobby.socket,
        user: state.account.user
    }));

    const canWatch = useCallback(
        (game) => !currentGame && (game.allowSpectators || user?.permissions?.canManageGames),
        [currentGame, user]
    );

    const canJoin = useCallback(
        (game) => !currentGame && !game.started && !game.full,
        [currentGame]
    );

    const joinGame = useCallback(
        (game) => {
            if (!user) {
                toast.danger(t('Please login before trying to join a game'));
                return;
            }

            const isAdmin = !!user?.permissions?.canManageGames;
            const requiresPassword = game.needsPassword && !isAdmin;

            if (requiresPassword) {
                dispatch(lobbyActions.joinPasswordGame({ game, joinType: 'Join' }));
            } else {
                socket.emit('joingame', game.id);
            }

            if (!requiresPassword && onJoinOrWatchClick) {
                onJoinOrWatchClick();
            }
        },
        [dispatch, onJoinOrWatchClick, socket, t, user]
    );

    const watchGame = useCallback(
        (game) => {
            if (!user) {
                toast.danger(t('Please login before trying to watch a game'));
                return;
            }

            const isAdmin = !!user?.permissions?.canManageGames;
            const requiresPassword = game.needsPassword && !isAdmin;

            if (requiresPassword) {
                dispatch(lobbyActions.joinPasswordGame({ game, joinType: 'Watch' }));
            } else {
                socket.emit('watchgame', game.id);
            }

            if (!requiresPassword && onJoinOrWatchClick) {
                onJoinOrWatchClick();
            }
        },
        [dispatch, onJoinOrWatchClick, socket, t, user]
    );

    const removeGame = useCallback(
        (game) => {
            socket.emit('removegame', game.id);
        },
        [socket]
    );

    const groupedGames = useMemo(() => {
        const isAdmin = !!user?.permissions?.canManageGames;
        const groups = { beginner: [], casual: [], competitive: [] };

        for (const game of games) {
            if (!game.started && game.gamePrivate && !isAdmin) {
                continue;
            }

            if (gameFilter.onlyShowNew && game.started) {
                continue;
            }

            if (!gameFilter[game.gameFormat] || !gameFilter[game.gameType]) {
                continue;
            }

            if (groups[game.gameType]) {
                groups[game.gameType].push(game);
            }
        }

        return groups;
    }, [gameFilter, games, user]);

    const sectionOrder = ['beginner', 'casual', 'competitive'];
    const renderedSections = sectionOrder
        .filter((type) => groupedGames[type]?.length > 0)
        .map((type) => ({ games: groupedGames[type], type }));

    if (renderedSections.length === 0) {
        return (
            <div className='w-full'>
                <AlertPanel
                    type='info'
                    message={t('There are no games matching the filters you have selected')}
                />
            </div>
        );
    }

    return (
        <div className='w-full space-y-3'>
            {renderedSections.map(({ games: typeGames, type }) => (
                <section key={type} className='space-y-2'>
                    <div className='inline-flex items-center rounded-md border border-border/70 bg-surface-secondary/65 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-foreground'>
                        {t(type)} ({typeGames.length})
                    </div>
                    <div className='space-y-2'>
                        {typeGames.map((game) => {
                            const isAdmin = !!user?.permissions?.canManageGames;
                            const elapsedMs = Math.max(0, moment().diff(moment(game.createdAt)));
                            const elapsed = moment.utc(elapsedMs).format('HH:mm');
                            const players = Object.values(game.players || {});
                            const iconClass = 'h-5 w-5 object-contain invert-[0.9]';
                            const rowTone =
                                game.node && isAdmin
                                    ? 'bg-surface-secondary/52'
                                    : 'bg-surface-secondary/38';
                            const seats = [players[0], players[1]];

                            return (
                                <div
                                    key={game.id}
                                    className={`rounded-md border border-border/50 px-3 py-2 transition hover:border-border/60 hover:bg-surface-secondary/58 ${rowTone}`}
                                >
                                    <div className='flex flex-wrap items-start justify-between gap-2'>
                                        <div className='min-w-0'>
                                            <div className='flex flex-wrap items-center gap-1.5'>
                                                <span className='truncate text-base font-semibold text-foreground'>
                                                    {game.name}
                                                </span>
                                                <span className='text-xs text-muted'>
                                                    [{elapsed}]
                                                </span>
                                                <span className='rounded-sm border border-border/70 bg-overlay/80 px-1.5 py-0.5 text-xs uppercase tracking-wide text-muted'>
                                                    {game.gameFormat}
                                                </span>
                                                {game.gamePrivate && isAdmin ? (
                                                    <span className='rounded-sm border border-border/70 bg-overlay/80 px-1.5 py-0.5 text-xs uppercase tracking-wide text-muted'>
                                                        Private
                                                    </span>
                                                ) : null}
                                                {game.node && isAdmin ? (
                                                    <span className='rounded-sm border border-border/70 bg-overlay/80 px-1.5 py-0.5 text-xs uppercase tracking-wide text-muted'>
                                                        {game.node}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-1.5'>
                                            <span
                                                className={`rounded-sm border px-1.5 py-0.5 text-xs font-medium uppercase tracking-wide ${
                                                    typeBadgeClass[type] ||
                                                    'border-border/70 text-muted'
                                                }`}
                                            >
                                                {t(type)}
                                            </span>
                                            {isAdmin ? (
                                                <Button
                                                    isIconOnly
                                                    size='sm'
                                                    variant='tertiary'
                                                    className='h-7 w-7 text-muted hover:text-foreground'
                                                    title={t('Remove game')}
                                                    onPress={() => removeGame(game)}
                                                >
                                                    <Icon icon={faTrash} />
                                                </Button>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className='mt-2 rounded-md border border-border/45 bg-overlay/45 p-2'>
                                        <div className='grid gap-2 sm:grid-cols-2'>
                                            {seats.map((player, seatIndex) => {
                                                if (player) {
                                                    const userClass = `username ${
                                                        player.role
                                                            ? `${player.role.toLowerCase()}-role`
                                                            : ''
                                                    }`;

                                                    return (
                                                        <div
                                                            key={`${game.id}-${player.name}`}
                                                            className='flex min-h-11 items-center gap-2 rounded-md border border-border/45 bg-surface-secondary/55 px-2 py-1.5 text-foreground'
                                                        >
                                                            <Avatar imgPath={player.avatar} />
                                                            <span className={userClass}>
                                                                {player.name}
                                                            </span>
                                                        </div>
                                                    );
                                                }

                                                if (canJoin(game)) {
                                                    return (
                                                        <button
                                                            key={`${game.id}-seat-${seatIndex}`}
                                                            type='button'
                                                            className='flex min-h-11 items-center gap-2 rounded-md border border-dashed border-border/50 bg-surface-secondary/35 px-2 py-1.5 text-left text-foreground/78 transition hover:cursor-pointer hover:border-accent/45 hover:bg-accent/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45'
                                                            onClick={() => joinGame(game)}
                                                        >
                                                            <span className='h-7 w-7 rounded-full border border-dashed border-border/55 bg-surface-secondary/55' />
                                                            <span className='text-sm font-semibold text-[color:var(--brand-red)]'>
                                                                {t('+ Join')}
                                                            </span>
                                                        </button>
                                                    );
                                                }

                                                return (
                                                    <div
                                                        key={`${game.id}-seat-${seatIndex}`}
                                                        className='flex min-h-11 items-center rounded-md border border-border/50 bg-surface-secondary/45 px-2 py-1.5 text-sm text-muted'
                                                    >
                                                        {t('Open slot')}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className='mt-2 flex flex-wrap items-center justify-between gap-2'>
                                        <div className='flex items-center gap-1.5 text-foreground'>
                                            {game.showHand && (
                                                <img
                                                    src={ShowHandIcon}
                                                    className={iconClass}
                                                    alt={t('Show hands to spectators')}
                                                    title={t('Show hands to spectators')}
                                                />
                                            )}
                                            {game.useGameTimeLimit && (
                                                <img
                                                    src={TimeLimitIcon}
                                                    className={iconClass}
                                                    alt={t('Time limit used')}
                                                    title={t('Time limit used')}
                                                />
                                            )}
                                            {game.needsPassword ? (
                                                <Icon
                                                    icon={faLock}
                                                    className='text-sm text-foreground/85'
                                                    title={t('Password protected')}
                                                />
                                            ) : null}
                                            {formatIconEntries.map(([key, icon]) => {
                                                if (
                                                    key === 'showHand' ||
                                                    key === 'useGameTimeLimit' ||
                                                    game.gameFormat !== key
                                                ) {
                                                    return null;
                                                }

                                                return (
                                                    <img
                                                        key={key}
                                                        src={icon.src}
                                                        className={
                                                            icon.noInvert
                                                                ? 'h-5 w-5 object-contain'
                                                                : iconClass
                                                        }
                                                        alt={t(icon.title)}
                                                        title={t(icon.title)}
                                                    />
                                                );
                                            })}
                                        </div>
                                        {canWatch(game) ? (
                                            <Button
                                                size='sm'
                                                variant='tertiary'
                                                className='text-foreground/75 hover:text-foreground'
                                                onPress={() => watchGame(game)}
                                            >
                                                {t('Watch')}
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
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
