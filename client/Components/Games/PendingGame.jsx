import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Input, toast } from '@heroui/react';

import Panel from '../Site/Panel';
import Messages from '../GameBoard/Messages';
import SelectDeckModal from './SelectDeckModal';
import {
    lobbyLeaveGameRequested,
    lobbySendMessage,
    lobbyStartGameRequested
} from '../../redux/socketActions';
import PendingGamePlayers from './PendingGamePlayers';
import GameTypeInfo from './GameTypeInfo';
import { Constants } from '../../constants';

import ChargeMp3 from '../../assets/sound/charge.mp3';
import ChargeOgg from '../../assets/sound/charge.ogg';

function showNotification(notification) {
    if (window.Notification && Notification.permission === 'granted') {
        const windowNotification = new Notification('The Crucible Online', notification);

        setTimeout(() => windowNotification.close(), 5000);
    }
}

const PendingGame = () => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.account.user);
    const { connecting, gameError, gameHost } = useSelector((state) => ({
        connecting: state.games.connecting,
        gameError: state.lobby.gameError,
        gameHost: state.games.gameHost
    }));
    const notification = useRef();
    const [waiting, setWaiting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [canScroll, setCanScroll] = useState(true);
    const [playerCount, setPlayerCount] = useState(0);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const messageRef = useRef(null);

    useEffect(() => {
        if (!user) {
            return;
        }

        const players = Object.values(currentGame.players).length;

        if (
            notification.current &&
            playerCount === 1 &&
            players === 2 &&
            currentGame.owner === user.username
        ) {
            const promise = notification.current?.play();

            if (promise !== undefined) {
                promise.catch(() => {}).then(() => {});
            }

            const otherPlayer = Object.values(currentGame.players).find(
                (p) => p.name !== user.username
            );

            showNotification({
                body: `${otherPlayer.name} has joined your game`,
                icon: `/img/avatar/${otherPlayer.username}.png`
            });
        }

        setPlayerCount(players);

        if (canScroll && messageRef.current) {
            messageRef.current.scrollTop = messageRef.current.scrollHeight;
        }

        if (connecting) {
            setWaiting(false);
        }
    }, [
        currentGame.owner,
        currentGame.players,
        user,
        playerCount,
        currentGame,
        canScroll,
        connecting
    ]);

    useEffect(() => {
        if (currentGame && currentGame.gameFormat === 'sealed') {
            dispatch(lobbySendMessage('getsealeddeck', currentGame.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!currentGame) {
        return null;
    }

    const deckFilter = {};
    let expansions = [];

    if (currentGame.gameFormat !== 'alliance') {
        deckFilter.isAlliance = false;
    }

    if (currentGame.gameFormat === 'unchained') {
        expansions = Constants.Expansions.filter((e) => e.value === '601');
    } else {
        expansions = Constants.Expansions.filter((e) => e.value !== '601');
    }

    deckFilter.expansion = expansions;

    const canClickStart = () => {
        if (!user || !currentGame || currentGame.owner !== user.username || connecting) {
            return false;
        }

        if (
            !Object.values(currentGame.players).every((player) => {
                return !!player.deck.selected;
            })
        ) {
            return false;
        }

        if (waiting && !gameError) {
            return false;
        }

        return true;
    };

    const playerCountInGame = Object.values(currentGame.players || {}).length;
    const allPlayersReady =
        playerCountInGame === 2 &&
        Object.values(currentGame.players || {}).every((player) => !!player.deck?.selected);

    const getLiveState = () => {
        if (currentGame.started) {
            return t('In progress');
        }
        if (connecting) {
            return t('Connecting');
        }
        if (playerCountInGame < 2) {
            return t('Waiting');
        }
        if (allPlayersReady) {
            return t('Ready');
        }

        return t('Full');
    };

    const getLiveStateClass = () => {
        const liveState = getLiveState();
        if (liveState === t('Ready')) {
            return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300';
        }
        if (liveState === t('Connecting')) {
            return 'border-sky-500/35 bg-sky-500/10 text-sky-300';
        }

        return 'border-amber-500/35 bg-amber-500/10 text-amber-300';
    };

    const getLiveDotClass = () => {
        if (allPlayersReady) {
            return {
                ping: 'bg-emerald-400/45',
                dot: 'bg-emerald-400'
            };
        }

        const anyDeckSelected = Object.values(currentGame.players || {}).some(
            (player) => !!player.deck?.selected
        );

        if (playerCountInGame < 2) {
            return {
                ping: anyDeckSelected ? 'bg-amber-400/45' : 'bg-rose-400/45',
                dot: anyDeckSelected ? 'bg-amber-400' : 'bg-rose-400'
            };
        }

        return {
            ping: 'bg-rose-400/45',
            dot: 'bg-rose-400'
        };
    };

    const getStartHint = () => {
        if (connecting) {
            return t('Connecting to game server');
        }

        if (playerCountInGame < 2) {
            return t('Waiting for players');
        }

        const missingDecks = Object.values(currentGame.players || {}).filter(
            (player) => !player.deck?.selected
        ).length;
        if (missingDecks > 0) {
            return t('Waiting for {{count}} player to select decks', { count: missingDecks });
        }

        if (waiting) {
            return t('Starting game...');
        }

        return t('Ready to start');
    };

    const getGameStatus = () => {
        if (gameError) {
            return t(gameError);
        }

        if (connecting) {
            return t('Connecting to game server {{host}}', { host: gameHost });
        }

        if (waiting) {
            return t('Waiting for lobby server...');
        }

        if (Object.values(currentGame.players).length < 2) {
            return t('Waiting for players...');
        }

        if (
            !Object.values(currentGame.players).every((player) => {
                return !!player.deck.selected;
            })
        ) {
            return t('Waiting for players to select decks');
        }

        if (currentGame.owner === user.username) {
            return t('Ready to begin, click start to begin the game');
        }

        return t('Ready to begin, waiting for opponent to start the game');
    };

    const formatLabel = (value) => {
        if (!value) {
            return '';
        }

        return value
            .toString()
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const sendMessage = () => {
        if (message === '') {
            return;
        }

        dispatch(lobbySendMessage('chat', message));
        setMessage('');
    };

    const handleCopyGameLink = async () => {
        const gameLink = `${window.location.protocol}//${window.location.host}/play?gameId=${currentGame.id}`;

        try {
            if (!navigator.clipboard?.writeText) {
                throw new Error('Clipboard unavailable');
            }

            await navigator.clipboard.writeText(gameLink);
            toast.success(t('Game link copied'));
        } catch (error) {
            toast.danger(t('Unable to copy game link'));
        }
    };

    const liveDotClass = getLiveDotClass();

    return (
        <>
            <audio ref={notification}>
                <source src={ChargeMp3} type='audio/mpeg' />
                <source src={ChargeOgg} type='audio/ogg' />
            </audio>

            <Panel title={currentGame.name} titleClass='text-base font-semibold tracking-wide'>
                <div className='space-y-3'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='rounded-md border border-border/70 bg-surface-secondary/60 px-2 py-0.5 text-xs text-zinc-300'>
                            {formatLabel(currentGame.gameFormat)}
                        </span>
                        <span className='rounded-md border border-border/70 bg-surface-secondary/60 px-2 py-0.5 text-xs text-zinc-300'>
                            {formatLabel(currentGame.gameType)}
                        </span>
                        <span className='rounded-md border border-border/70 bg-surface-secondary/60 px-2 py-0.5 text-xs text-zinc-300'>
                            {t('{{players}} / 2 players', { players: playerCountInGame })}
                        </span>
                        <span
                            className={`rounded-md border px-2 py-0.5 text-xs font-medium ${getLiveStateClass()}`}
                        >
                            {getLiveState()}
                        </span>
                    </div>

                    <div className='flex items-center gap-2 text-lg font-semibold text-zinc-100'>
                        <span className='relative inline-flex h-2.5 w-2.5'>
                            <span
                                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-80 ${liveDotClass.ping}`}
                            />
                            <span
                                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${liveDotClass.dot}`}
                            />
                        </span>
                        <span>{getGameStatus()}</span>
                    </div>

                    <GameTypeInfo gameType={currentGame.gameType} />

                    <div className='flex flex-wrap items-center gap-2 border-t border-border/60 pt-3'>
                        <Button
                            variant='primary'
                            isDisabled={!canClickStart()}
                            onPress={() => {
                                setWaiting(true);
                                dispatch(lobbyStartGameRequested(currentGame.id));
                            }}
                        >
                            <Trans>Start</Trans>
                        </Button>
                        <Button
                            variant='secondary'
                            onPress={() => {
                                dispatch(lobbyLeaveGameRequested(currentGame.id));
                            }}
                        >
                            <Trans>Leave</Trans>
                        </Button>
                        <Button variant='secondary' onPress={handleCopyGameLink}>
                            <Trans>Copy Game Link</Trans>
                        </Button>
                        <span className='ms-auto text-xs text-zinc-400'>{getStartHint()}</span>
                    </div>
                </div>
            </Panel>

            <PendingGamePlayers
                currentGame={currentGame}
                user={user}
                onSelectDeck={() => setShowModal(true)}
            />

            <Panel
                headerVariant='context'
                title={t('Chat')}
                titleClass='text-xs font-medium tracking-wide text-zinc-300'
            >
                <div
                    className='mb-2 h-[150px] w-full overflow-y-auto rounded-md border border-border/55 bg-surface-secondary/35 px-3 py-2 text-sm'
                    ref={messageRef}
                    onScroll={() => {
                        setTimeout(() => {
                            if (!messageRef.current) {
                                return;
                            }

                            if (
                                messageRef.current.scrollTop >=
                                messageRef.current.scrollHeight -
                                    messageRef.current.offsetHeight -
                                    20
                            ) {
                                setCanScroll(true);
                            } else {
                                setCanScroll(false);
                            }
                        }, 500);
                    }}
                >
                    <Messages messages={currentGame.messages} />
                </div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        sendMessage();
                    }}
                >
                    <Input
                        className='w-full'
                        type='text'
                        placeholder={t('Enter a message...')}
                        value={message}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                sendMessage();
                            }
                        }}
                        onChange={(event) => setMessage(event.target.value)}
                    />
                </form>
            </Panel>

            {currentGame.spectators.length > 0 ? (
                <Panel
                    headerVariant='context'
                    title={t('Spectators ({{users}})', {
                        users: currentGame.spectators.length
                    })}
                    titleClass='text-xs font-medium tracking-wide text-zinc-300'
                >
                    <div className='flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-200'>
                        {currentGame.spectators.map((spectator) => (
                            <span key={spectator.name}>{spectator.name}</span>
                        ))}
                    </div>
                </Panel>
            ) : (
                <div className='rounded-md border border-border/60 bg-surface-secondary/35 px-3 py-1.5 text-xs text-zinc-400'>
                    <Trans>Spectators: none</Trans>
                </div>
            )}

            {showModal && (
                <SelectDeckModal
                    expansions={expansions}
                    deckFilter={deckFilter}
                    onClose={() => setShowModal(false)}
                    onDeckSelected={(deck) => {
                        setShowModal(false);
                        dispatch(
                            lobbySendMessage(
                                'selectdeck',
                                currentGame.id,
                                deck.id,
                                deck.isStandalone
                            )
                        );
                    }}
                />
            )}
        </>
    );
};

PendingGame.displayName = 'PendingGame';

export default PendingGame;
