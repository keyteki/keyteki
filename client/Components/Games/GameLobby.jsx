import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../HeroUI/Button';
import { Switch } from '@heroui/react';

import NewGame from './NewGame';
import GameList from './GameList';
import PendingGame from './PendingGame';
import PasswordGame from './PasswordGame';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';

import './GameLobby.scss';
import { useEffect } from 'react';
import { startNewGame, joinPasswordGame, sendSocketMessage, setUrl } from '../../redux/actions';
import { useRef } from 'react';

const GameLobby = ({ gameId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const filters = [
        { name: 'beginner', label: t('Beginner') },
        { name: 'casual', label: t('Casual') },
        { name: 'competitive', label: t('Competitive') },
        { name: 'normal', label: t('Normal') },
        { name: 'sealed', label: t('Sealed') },
        { name: 'reversal', label: t('Reversal') },
        { name: 'adaptive-bo1', label: t('Adaptive (Bo1)') },
        { name: 'alliance', label: t('Alliance') },
        { name: 'unchained', label: t('Unchained') }
    ];
    const filterDefaults = {};

    for (const filter of filters) {
        filterDefaults[filter.name] = true;
    }

    const { games, newGame, currentGame, passwordGame } = useSelector((state) => ({
        games: state.lobby.games,
        newGame: state.lobby.newGame,
        currentGame: state.lobby.currentGame,
        passwordGame: state.lobby.passwordGame
    }));
    const user = useSelector((state) => state.account.user);
    const [currentFilter, setCurrentFilter] = useState(filterDefaults);
    const [quickJoin, setQuickJoin] = useState(false);
    const topRef = useRef(null);

    useEffect(() => {
        if ('Notification' in window) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission(() => {});
            }
        }

        let filter = localStorage.getItem('gameFilter');
        if (filter) {
            setCurrentFilter(JSON.parse(filter));
        }
    }, []);

    const onFilterChecked = (name, checked) => {
        currentFilter[name] = checked;
        setCurrentFilter(Object.assign({}, currentFilter));

        localStorage.setItem('gameFilter', JSON.stringify(currentFilter));
    };

    useEffect(() => {
        if (!currentGame && gameId && games.length > 0) {
            const game = games.find((x) => x.id === gameId);

            if (!game) {
                toastr.error('Error', 'The game you tried to join was not found.');
            } else {
                if (!game.started && Object.keys(game.players).length < 2) {
                    if (game.needsPassword) {
                        dispatch(joinPasswordGame(game, 'Join'));
                    } else {
                        dispatch(sendSocketMessage('joingame', gameId));
                    }
                } else {
                    if (game.needsPassword) {
                        dispatch(joinPasswordGame(game, 'Watch'));
                    } else {
                        dispatch(sendSocketMessage('watchgame', game.id));
                    }
                }
            }
            dispatch(setUrl('/play'));
        }
    }, [currentGame, dispatch, gameId, games]);

    return (
        <div className='mx-auto max-w-4xl px-4'>
            <div ref={topRef}>
                {newGame && <NewGame quickJoin={quickJoin} />}
                {currentGame?.started === false && <PendingGame />}
                {passwordGame && <PasswordGame />}
            </div>
            <Panel title={t('Current Games')}>
                {!user && (
                    <div className='text-center'>
                        <AlertPanel type='warning'>
                            {t('Please log in to be able to start a new game')}
                        </AlertPanel>
                    </div>
                )}
                <div className='game-buttons grid grid-cols-1 lg:grid-cols-4 gap-4'>
                    <div className='flex flex-col gap-2'>
                        <Button
                            isDisabled={!user}
                            color='primary'
                            onPress={() => {
                                setQuickJoin(false);
                                dispatch(startNewGame());
                            }}
                        >
                            <Trans>New Game</Trans>
                        </Button>
                        <Button
                            isDisabled={!user}
                            color='primary'
                            onPress={() => {
                                setQuickJoin(true);
                                dispatch(startNewGame());
                            }}
                        >
                            <Trans>Quick Join</Trans>
                        </Button>
                    </div>
                    <div className='lg:col-span-3'>
                        <Panel type='primary'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                                {filters.map((filter) => {
                                    return (
                                        <div key={filter.name} className='flex items-center'>
                                            <Switch
                                                isSelected={!!currentFilter[filter.name]}
                                                onValueChange={(val) =>
                                                    onFilterChecked(filter.name, val)
                                                }
                                            >
                                                {filter.label}
                                            </Switch>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className='mt-2'>
                                <Switch
                                    isSelected={!!currentFilter['onlyShowNew']}
                                    onValueChange={(val) => onFilterChecked('onlyShowNew', val)}
                                >
                                    {t('Only show new games')}
                                </Switch>
                            </div>
                        </Panel>
                    </div>
                </div>
                <div className='text-center mt-4'>
                    {games.length === 0 ? (
                        <AlertPanel type='info'>
                            {t(
                                'No games are currently in progress. Click the buttons above to start one.'
                            )}
                        </AlertPanel>
                    ) : (
                        <GameList
                            games={games}
                            gameFilter={currentFilter}
                            onJoinOrWatchClick={() => topRef.current.scrollIntoView(false)}
                        />
                    )}
                </div>
            </Panel>
        </div>
    );
};

export default GameLobby;
