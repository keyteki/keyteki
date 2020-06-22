import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactClipboard from 'react-clipboardjs-copy';
import { Button, Form } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';

import Panel from '../Site/Panel';
import Messages from '../GameBoard/Messages';
import SelectDeckModal from './SelectDeckModal';
import { startGame, leaveGame, sendSocketMessage } from '../../redux/actions';
import PendingGamePlayers from './PendingGamePlayers';
import ChargeMp3 from '../../assets/sound/charge.mp3';
import ChargeOgg from '../../assets/sound/charge.ogg';

import './PendingGame.scss';
import { useEffect } from 'react';

function showNotification(notification) {
    if (window.Notification && Notification.permission === 'granted') {
        let windowNotification = new Notification('The Crucible Online', notification);

        setTimeout(() => windowNotification.close(), 5000);
    }
}

const PendingGame = () => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.account.user);
    const { connecting, gameError } = useSelector((state) => ({
        connecting: state.games.connecting,
        gameError: state.games.gameError
    }));
    const notification = useRef();
    const [waiting, setWaiting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [playerCount, setPlayerCount] = useState(0);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        if (!user) {
            return;
        }

        let players = Object.values(currentGame.players).length;

        if (
            notification.current &&
            playerCount === 1 &&
            players === 2 &&
            currentGame.owner === user.username
        ) {
            let promise = notification.current?.play();

            if (promise !== undefined) {
                promise.catch(() => {}).then(() => {});
            }

            let otherPlayer = Object.values(currentGame.players).find(
                (p) => p.name !== user.username
            );

            showNotification({
                body: `${otherPlayer.name} has joined your game`,
                icon: `/img/avatar/${otherPlayer.username}.png`
            });
        }

        setPlayerCount(players);
    }, [currentGame.owner, currentGame.players, user, playerCount, currentGame]);

    useEffect(() => {
        if (currentGame && currentGame.gameFormat === 'sealed') {
            dispatch(sendSocketMessage('getsealeddeck', currentGame.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!currentGame) {
        return null;
    }

    if (connecting) {
        setWaiting(false);
    }

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

    const getGameStatus = () => {
        if (gameError) {
            return t(gameError);
        }

        if (connecting) {
            return t('Connecting to game server {{host}}', { host: host });
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

    const sendMessage = () => {
        if (message === '') {
            return;
        }

        dispatch(sendSocketMessage('chat', message));

        setMessage('');
    };

    return (
        <>
            <audio ref={notification}>
                <source src={ChargeMp3} type='audio/mpeg' />
                <source src={ChargeOgg} type='audio/ogg' />
            </audio>
            <Panel title={currentGame.name}>
                <Button
                    variant='success'
                    disabled={!canClickStart()}
                    onClick={() => {
                        setWaiting(true);
                        dispatch(startGame(currentGame.id));
                    }}
                >
                    <Trans>Start</Trans>
                </Button>
                <Button
                    variant='primary'
                    onClick={() => {
                        dispatch(leaveGame(currentGame.id));
                    }}
                >
                    <Trans>Leave</Trans>
                </Button>
                <div className='float-right'>
                    <ReactClipboard
                        text={`${window.location.protocol}//${window.location.host}/play?gameId=${currentGame.id}`}
                    >
                        <Button variant='primary'>
                            <Trans>Copy Game Link</Trans>
                        </Button>
                    </ReactClipboard>
                </div>
                <div className='game-status'>{getGameStatus()}</div>
            </Panel>
            <PendingGamePlayers
                currentGame={currentGame}
                user={user}
                onSelectDeck={() => setShowModal(true)}
            />
            <Panel
                title={t('Spectators({{users}})', {
                    users: currentGame.spectators.length
                })}
            >
                {currentGame.spectators.map((spectator) => {
                    return <div key={spectator.name}>{spectator.name}</div>;
                })}
            </Panel>
            <Panel title={t('Chat')}>
                <div className='message-list'>
                    <Messages messages={currentGame.messages} />
                </div>
                <Form>
                    <Form.Group>
                        <Form.Control
                            type='text'
                            placeholder={t('Enter a message...')}
                            value={message}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    sendMessage();
                                    event.preventDefault();
                                }
                            }}
                            onChange={(event) => setMessage(event.target.value)}
                        ></Form.Control>
                    </Form.Group>
                </Form>
            </Panel>
            {showModal && (
                <SelectDeckModal
                    onClose={() => setShowModal(false)}
                    onDeckSelected={(deck) => {
                        setShowModal(false);
                        dispatch(
                            sendSocketMessage(
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
