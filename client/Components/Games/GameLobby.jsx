import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Label, Switch, toast } from '@heroui/react';
import { Trans, useTranslation } from 'react-i18next';

import NewGame from './NewGame';
import GameList from './GameList';
import PendingGame from './PendingGame';
import PasswordGame from './PasswordGame';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import { lobbyActions } from '../../redux/slices/lobbySlice';
import { lobbySendMessage } from '../../redux/socketActions';
import { useLocation, useNavigate } from 'react-router-dom';

const createMockLobbyGames = () => {
    const mockPlayers = {
        admin: {
            avatar: 'test0',
            deck: { selected: true, status: { basicRules: true } },
            id: 'p-admin',
            name: 'admin',
            role: 'admin'
        },
        test: {
            avatar: 'test1',
            deck: { selected: true, status: { basicRules: true } },
            id: 'p-test',
            name: 'test',
            role: 'supporter'
        },
        contributor: {
            avatar: 'test2',
            deck: { selected: true, status: { basicRules: true } },
            id: 'p-contributor',
            name: 'contributor',
            role: 'contributor'
        }
    };

    const makeGame = (overrides) => ({
        allowSpectators: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
        full: false,
        gameFormat: 'normal',
        gamePrivate: false,
        gameType: 'casual',
        id: `mock-${Math.random().toString(36).slice(2, 10)}`,
        messages: [],
        needsPassword: false,
        owner: 'admin',
        players: { admin: mockPlayers.admin },
        showHand: false,
        spectators: [{ id: 's1', name: 'spectator1' }],
        started: false,
        useGameTimeLimit: false,
        ...overrides
    });

    const demoNodes = ['node1', 'node2', 'node3'];
    let nodeIndex = 0;
    const withDemoNode = (game) => {
        const nextNode = demoNodes[nodeIndex % demoNodes.length];
        nodeIndex += 1;

        return {
            ...game,
            node: nextNode
        };
    };

    return [
        withDemoNode(
            makeGame({
                gameFormat: 'normal',
                gameType: 'beginner',
                name: 'Beginner Open Normal',
                players: { admin: mockPlayers.admin }
            })
        ),
        withDemoNode(
            makeGame({
                gameFormat: 'sealed',
                gameType: 'casual',
                name: 'Casual Sealed + Time',
                useGameTimeLimit: true
            })
        ),
        withDemoNode(
            makeGame({
                gameFormat: 'reversal',
                gameType: 'competitive',
                name: 'Competitive Reversal (password)',
                needsPassword: true
            })
        ),
        withDemoNode(
            makeGame({
                gameFormat: 'adaptive-bo1',
                gameType: 'competitive',
                name: 'Adaptive Bo1 + Show Hand',
                showHand: true
            })
        ),
        withDemoNode(
            makeGame({
                gameFormat: 'alliance',
                gameType: 'casual',
                name: 'Alliance Feature Match',
                players: { admin: mockPlayers.admin, test: mockPlayers.test },
                started: true,
                full: true
            })
        ),
        withDemoNode(
            makeGame({
                gameFormat: 'unchained',
                gameType: 'beginner',
                name: 'Unchained Ladder',
                players: { admin: mockPlayers.admin, contributor: mockPlayers.contributor },
                started: false,
                full: true,
                useGameTimeLimit: true
            })
        ),
        withDemoNode(
            makeGame({
                gameFormat: 'normal',
                gameType: 'casual',
                name: 'Everything On',
                needsPassword: true,
                showHand: true,
                useGameTimeLimit: true
            })
        )
    ];
};

const GameLobby = ({ gameId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const filters = useMemo(
        () => [
            { name: 'beginner', label: t('Beginner') },
            { name: 'casual', label: t('Casual') },
            { name: 'competitive', label: t('Competitive') },
            { name: 'normal', label: t('Normal') },
            { name: 'sealed', label: t('Sealed') },
            { name: 'reversal', label: t('Reversal') },
            { name: 'adaptive-bo1', label: t('Adaptive (Bo1)') },
            { name: 'alliance', label: t('Alliance') },
            { name: 'unchained', label: t('Unchained') }
        ],
        [t]
    );
    const filterDefaults = useMemo(() => {
        const defaults = {};
        for (const filter of filters) {
            defaults[filter.name] = true;
        }
        return defaults;
    }, [filters]);

    const { games, newGame, newGameInstance, currentGame, passwordGame, gameError } = useSelector(
        (state) => ({
            games: state.lobby.games,
            newGame: state.lobby.newGame,
            newGameInstance: state.lobby.newGameInstance,
            currentGame: state.lobby.currentGame,
            passwordGame: state.lobby.passwordGame,
            gameError: state.lobby.gameError
        })
    );
    const user = useSelector((state) => state.account.user);
    const [currentFilter, setCurrentFilter] = useState(filterDefaults);
    const [quickJoin, setQuickJoin] = useState(false);
    const topRef = useRef(null);
    const useMockGames = useMemo(() => {
        const search = new URLSearchParams(location.search);
        return search.get('mockGames') === '1';
    }, [location.search]);
    const mockGames = useMemo(() => createMockLobbyGames(), []);
    const visibleGames = useMemo(
        () => (useMockGames ? mockGames : games),
        [games, mockGames, useMockGames]
    );

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission(() => {});
        }

        const filter = localStorage.getItem('gameFilter');
        if (filter) {
            setCurrentFilter({ ...filterDefaults, ...JSON.parse(filter) });
        }
    }, [filterDefaults]);

    const onFilterChecked = (name, checked) => {
        const nextFilter = {
            ...currentFilter,
            [name]: checked
        };

        setCurrentFilter(nextFilter);
        localStorage.setItem('gameFilter', JSON.stringify(nextFilter));
    };

    const openNewGame = (isQuickJoin) => {
        setQuickJoin(isQuickJoin);
        dispatch(lobbyActions.startNewGame());
    };

    useEffect(() => {
        if (!currentGame && gameId && visibleGames.length > 0) {
            const game = visibleGames.find((x) => x.id === gameId);
            const isAdmin = !!user?.permissions?.canManageGames;
            const requiresPassword = game?.needsPassword && !isAdmin;

            if (!game) {
                toast.danger(t('The game you tried to join was not found.'));
            } else if (!game.started && Object.keys(game.players).length < 2) {
                if (requiresPassword) {
                    dispatch(lobbyActions.joinPasswordGame({ game, joinType: 'Join' }));
                } else {
                    dispatch(lobbySendMessage('joingame', gameId));
                }
            } else if (requiresPassword) {
                dispatch(lobbyActions.joinPasswordGame({ game, joinType: 'Watch' }));
            } else {
                dispatch(lobbySendMessage('watchgame', game.id));
            }

            navigate('/play', { replace: true });
        }
    }, [currentGame, dispatch, gameId, navigate, t, user, visibleGames]);

    useEffect(() => {
        if (!gameError) {
            return;
        }

        const gameRemovedError = 'The game has timed out and is no longer available.';
        const shouldToast = gameError === gameRemovedError;

        if (!shouldToast) {
            return;
        }

        toast.danger(t(gameError));
        dispatch(lobbyActions.clearGameError());
    }, [currentGame, dispatch, gameError, t]);

    return (
        <div className='mx-auto w-full max-w-6xl' ref={topRef}>
            {newGame && <NewGame key={`new-game-${newGameInstance}`} quickJoin={quickJoin} />}
            {currentGame?.started === false && <PendingGame />}
            {passwordGame && <PasswordGame />}

            <Panel title={t('Current Games')} titleClass='text-base font-semibold tracking-wide'>
                {!user && (
                    <AlertPanel type='warning'>
                        {t('Please log in to be able to start a new game')}
                    </AlertPanel>
                )}

                <div className='grid items-start gap-3 lg:grid-cols-[220px_minmax(0,1fr)]'>
                    <div className='grid gap-2'>
                        <Button
                            className='w-full'
                            variant='tertiary'
                            isDisabled={!user}
                            onPress={() => openNewGame(false)}
                        >
                            <Trans>New Game</Trans>
                        </Button>
                        <Button
                            className='w-full'
                            variant='tertiary'
                            isDisabled={!user}
                            onPress={() => openNewGame(true)}
                        >
                            <Trans>Quick Join</Trans>
                        </Button>
                    </div>

                    <Panel
                        type='primary'
                        className='border-border/55 !bg-surface/97 [--accent:color-mix(in_oklab,var(--brand-red)_88%,white)]'
                        headerVariant='context'
                        title={t('Filters')}
                        titleClass='text-xs font-medium uppercase tracking-wide text-muted'
                    >
                        <div className='grid gap-x-3 gap-y-2 sm:grid-cols-2 lg:grid-cols-3'>
                            {filters.map((filter) => (
                                <div
                                    key={filter.name}
                                    className='flex items-center justify-between gap-2 rounded border border-border/45 bg-surface-secondary/45 px-2 py-1.5'
                                >
                                    <Label className='text-sm text-foreground'>
                                        {filter.label}
                                    </Label>
                                    <Switch
                                        id={filter.name}
                                        isSelected={!!currentFilter[filter.name]}
                                        onChange={(isSelected) =>
                                            onFilterChecked(filter.name, isSelected)
                                        }
                                    >
                                        <Switch.Control>
                                            <Switch.Thumb />
                                        </Switch.Control>
                                    </Switch>
                                </div>
                            ))}
                        </div>
                        <div className='mt-2 flex items-center justify-between gap-2 rounded border border-border/45 bg-surface-secondary/45 px-2 py-1.5'>
                            <Label className='text-sm text-foreground'>
                                {t('Only show new games')}
                            </Label>
                            <Switch
                                id='onlyShowNew'
                                isSelected={!!currentFilter.onlyShowNew}
                                onChange={(isSelected) =>
                                    onFilterChecked('onlyShowNew', isSelected)
                                }
                            >
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                            </Switch>
                        </div>
                    </Panel>
                </div>

                <div className='mt-3'>
                    {visibleGames.length === 0 ? (
                        <AlertPanel type='info'>
                            {t(
                                'No games are currently in progress. Click the buttons above to start one.'
                            )}
                        </AlertPanel>
                    ) : (
                        <GameList
                            games={visibleGames}
                            gameFilter={currentFilter}
                            onJoinOrWatchClick={() => topRef.current?.scrollIntoView(false)}
                        />
                    )}
                </div>
            </Panel>
        </div>
    );
};

export default GameLobby;
