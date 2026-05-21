import classNames from 'classnames';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { gameSendMessage } from '../../redux/socketActions';
import CardBack from '../Decks/CardBack';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import CardZoom from './CardZoom';
import { canShowDeckName, getMatchRecord, isSpectating, normalizePlayer } from './gameboardUtils';
import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import PlayerBoard from './PlayerBoard';
import PlayerStats from './PlayerStats';
import ReferenceCardPane from './ReferenceCardPane';
import TimeLimitClock from './TimeLimitClock';

const hasDenseRow = (player) => {
    const cardsInPlay = player?.cardPiles?.cardsInPlay || [];
    const grouped = cardsInPlay.reduce((acc, card) => {
        const key = card.type || 'other';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    return Object.values(grouped).some((count) => count >= 6);
};

export const GameBoard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const cards = useSelector((state) => state.cards.cards);
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.account.user);
    const [cardToZoom, setCardToZoom] = useState(null);
    const [showMessages, setShowMessages] = useState(true);
    const [lastMessageCount, setLastMessageCount] = useState(0);
    const [newMessages, setNewMessages] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const currentMessageCount = currentGame ? currentGame.messages.length : 0;
    const sendGameMessage = useMemo(
        () =>
            (message, ...args) =>
                dispatch(gameSendMessage(message, ...args)),
        [dispatch]
    );

    useEffect(() => {
        if (!currentGame) {
            return;
        }
        if (showMessages) {
            setLastMessageCount(currentMessageCount);
            setNewMessages(0);
        } else {
            setNewMessages(currentMessageCount - lastMessageCount);
        }
    }, [currentGame, currentMessageCount, lastMessageCount, showMessages]);

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [navigate, user]);

    // Track the chat panel's left edge so the from-chat zoomed card can be
    // positioned just to the left of the chat instead of covering it. We use
    // a callback ref + state so the effect re-runs whenever the chat element
    // actually mounts/unmounts (e.g. after the initial "Waiting for server"
    // early-return), not just when `showMessages` toggles.
    const [chatScrollEl, setChatScrollEl] = useState(null);
    useLayoutEffect(() => {
        if (!chatScrollEl) {
            return undefined;
        }
        const updateChatLeft = () => {
            const left = chatScrollEl.getBoundingClientRect().left;
            document.documentElement.style.setProperty('--chat-left', `${left}px`);
        };
        updateChatLeft();
        let observer;
        if (typeof ResizeObserver !== 'undefined') {
            observer = new ResizeObserver(updateChatLeft);
            observer.observe(chatScrollEl);
        }
        window.addEventListener('resize', updateChatLeft);
        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', updateChatLeft);
        };
    }, [chatScrollEl]);

    if (Object.values(cards).length === 0 || !currentGame?.started) {
        return (
            <div>
                <Trans>Waiting for server...</Trans>
            </div>
        );
    }

    if (!user) {
        return (
            <div>
                <Trans>You are not logged in, redirecting...</Trans>
            </div>
        );
    }

    let thisPlayer = currentGame.players[user.username];
    if (!thisPlayer) {
        thisPlayer = Object.values(currentGame.players)[0];
    }

    if (!thisPlayer) {
        return (
            <div>
                <Trans>Waiting for game to have players or close...</Trans>
            </div>
        );
    }

    let otherPlayer = Object.values(currentGame.players).find((player) => {
        return player.name !== thisPlayer.name;
    });

    thisPlayer = normalizePlayer(thisPlayer);
    otherPlayer = normalizePlayer(otherPlayer);
    const highDensity = hasDenseRow(thisPlayer) || hasDenseRow(otherPlayer);

    const boardClass = classNames('game-board', {
        'select-cursor': thisPlayer && thisPlayer.selectCard,
        'high-density': highDensity
    });
    const manualMode = currentGame.manualMode;
    const spectating = isSpectating(currentGame, user);
    const showDeckName = (isMe) => canShowDeckName(currentGame, isMe);

    const onMouseOver = (card) => {
        if (card.image) {
            setCardToZoom(card);
        }
    };

    const onMouseOut = () => {
        setCardToZoom(null);
    };

    const onCardClick = (card) => {
        const cannotPlayCard =
            typeof card?.canPlay === 'boolean' &&
            !card.canPlay &&
            !card.selected &&
            !card.selectable;

        if (!card || card.unselectable || cannotPlayCard) {
            return;
        }

        if (thisPlayer?.selectCard && !card.selectable) {
            return;
        }

        sendGameMessage('cardClicked', card.uuid);
    };

    const handleDrawPopupChange = (event) => {
        sendGameMessage('showDrawDeck', event.visible);
    };

    const sendChatMessage = (message) => {
        sendGameMessage('chat', message);
    };

    const onShuffleClick = () => {
        sendGameMessage('shuffleDeck');
    };

    const onDragDrop = (card, source, target) => {
        sendGameMessage('drop', card.uuid, source, target);
    };

    const onClickTide = () => {
        sendGameMessage('clickTide');
    };

    const onClickProphecy = (card) => {
        sendGameMessage('clickProphecy', card.uuid);
    };

    const onCommand = (command, arg, uuid, method) => {
        sendGameMessage(command, arg, uuid, method);
    };

    const onMenuItemClick = (card, menuItem) => {
        sendGameMessage('menuItemClick', card.uuid, menuItem);
    };

    const onOptionSettingToggle = (option, value) => {
        sendGameMessage('toggleOptionSetting', option, value);
    };

    const onMuteClick = () => {
        sendGameMessage('toggleMuteSpectators');
    };

    const onSettingsClick = () => {
        setShowModal(true);
    };

    const onMessagesClick = () => {
        const showState = !showMessages;
        setShowMessages(showState);
        if (showState) {
            setNewMessages(0);
            setLastMessageCount(currentGame.messages.length);
        }
    };

    const onManualModeClick = (event) => {
        event.preventDefault();
        sendGameMessage('toggleManualMode');
    };

    const timeLimitClock = currentGame.useGameTimeLimit ? (
        <TimeLimitClock
            timeLimitStarted={currentGame.gameTimeLimitStarted}
            timeLimitStartedAt={currentGame.gameTimeLimitStartedAt}
            timeLimit={currentGame.gameTimeLimitTime}
            paused={!!currentGame.winner && thisPlayer.promptTitle === 'Game Won'}
        />
    ) : null;

    const renderBoard = () => [
        <div key='board-middle' className='board-middle'>
            <div className='board-inner'>
                <div className='play-area'>
                    <div
                        className={classNames('board-atmosphere-overlay', {
                            dense: highDensity
                        })}
                    />
                    <PlayerBoard
                        cardBack={
                            <CardBack
                                size={user.settings.cardSize}
                                deck={otherPlayer.deckData}
                                showDeckName={showDeckName(false)}
                            />
                        }
                        cardsInPlay={otherPlayer.cardPiles.cardsInPlay}
                        hasActiveHouse={false}
                        isSpectating={spectating}
                        onCardClick={onCardClick}
                        onMenuItemClick={onMenuItemClick}
                        onMouseOut={onMouseOut}
                        onMouseOver={onMouseOver}
                        rowDirection='reverse'
                        tide={otherPlayer?.stats?.tide}
                        user={user}
                    />
                    <PlayerBoard
                        cardBack={
                            <CardBack
                                size={user.settings.cardSize}
                                deck={thisPlayer.deckData}
                                showDeckName={showDeckName(!spectating)}
                            />
                        }
                        cardsInPlay={thisPlayer.cardPiles.cardsInPlay}
                        cardSize={user.settings.cardSize}
                        hand={thisPlayer.cardPiles.hand}
                        hasActiveHouse={Boolean(thisPlayer.activeHouse)}
                        isMe={!spectating}
                        isSpectating={spectating}
                        manualMode={currentGame.manualMode}
                        onCardClick={onCardClick}
                        onDragDrop={onDragDrop}
                        onMenuItemClick={onMenuItemClick}
                        onMouseOut={onMouseOut}
                        onMouseOver={onMouseOver}
                        rowDirection='default'
                        activePlayer={thisPlayer.activePlayer}
                        tide={thisPlayer.stats.tide}
                        user={user}
                    />
                </div>
            </div>
        </div>
    ];

    return (
        <div className={boardClass}>
            {showModal && (
                <GameConfigurationModal
                    optionSettings={thisPlayer.optionSettings}
                    onOptionSettingToggle={onOptionSettingToggle}
                    onClose={() => setShowModal(false)}
                />
            )}
            <div className='stats-top'>
                <PlayerStats
                    activeHouse={otherPlayer.activeHouse}
                    activePlayer={otherPlayer.activePlayer}
                    cardBack={
                        <CardBack
                            size={user.settings.cardSize}
                            deck={otherPlayer.deckData}
                            showDeckName={showDeckName(false)}
                        />
                    }
                    cardPiles={otherPlayer.cardPiles}
                    deck={otherPlayer.deckData}
                    houses={otherPlayer.houses}
                    isMe={false}
                    numDeckCards={otherPlayer.numDeckCards}
                    onCardClick={onCardClick}
                    onDragDrop={onDragDrop}
                    onDrawPopupChange={handleDrawPopupChange}
                    onMenuItemClick={onMenuItemClick}
                    onMouseOut={onMouseOut}
                    onMouseOver={onMouseOver}
                    onShuffleClick={onShuffleClick}
                    showDeckName={showDeckName(false)}
                    side='top'
                    size={user.settings.cardSize}
                    spectating={spectating}
                    stats={otherPlayer.stats}
                    tideRequired={thisPlayer.stats.tideRequired || otherPlayer?.stats?.tideRequired}
                    user={otherPlayer.user}
                />
            </div>
            <div className='main-window'>
                {renderBoard()}
                {cardToZoom && <CardZoom card={cardToZoom} />}
                <div className='right-side'>
                    <div className='prompt-area relative box-border flex w-64 shrink-0 flex-col items-center justify-end overflow-visible bg-[color:color-mix(in_oklab,var(--surface)_94%,transparent)] px-0.5'>
                        <ReferenceCardPane
                            thisPlayer={thisPlayer}
                            otherPlayer={otherPlayer}
                            currentGame={currentGame}
                            user={user}
                            i18n={i18n}
                            t={t}
                            onMouseOver={onMouseOver}
                            onMouseOut={onMouseOut}
                            onCardClick={onCardClick}
                            onClickTide={onClickTide}
                            onClickProphecy={onClickProphecy}
                            onMenuItemClick={onMenuItemClick}
                            cardSize={user.settings.cardSize}
                            showDeckName={showDeckName}
                            spectating={spectating}
                        />
                        <div className='inset-pane'>
                            {spectating ? (
                                <div />
                            ) : (
                                <ActivePlayerPrompt
                                    cards={cards}
                                    buttons={thisPlayer.buttons}
                                    controls={thisPlayer.controls}
                                    promptText={thisPlayer.menuTitle}
                                    promptTitle={thisPlayer.promptTitle}
                                    onButtonClick={onCommand}
                                    onClickTide={onClickTide}
                                    onMouseOver={onMouseOver}
                                    onMouseOut={onMouseOut}
                                    user={user}
                                    phase={thisPlayer.phase}
                                />
                            )}
                            {timeLimitClock}
                        </div>
                    </div>
                    <div ref={setChatScrollEl} className='chat-scroll'>
                        {showMessages && (
                            <div className='relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden box-border'>
                                <GameChat
                                    key='gamechat'
                                    messages={currentGame.messages}
                                    onCardMouseOut={onMouseOut}
                                    onCardMouseOver={onMouseOver}
                                    onSendChat={sendChatMessage}
                                    muted={spectating && currentGame.muteSpectators}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PlayerStats
                activeHouse={thisPlayer.activeHouse}
                activePlayer={thisPlayer.activePlayer}
                cardBack={
                    <CardBack
                        size={user.settings.cardSize}
                        deck={thisPlayer.deckData}
                        showDeckName={showDeckName(!spectating)}
                    />
                }
                cardPiles={thisPlayer.cardPiles}
                deck={thisPlayer.deckData}
                houses={thisPlayer.houses}
                isMe={!spectating}
                manualMode={manualMode}
                matchRecord={getMatchRecord(thisPlayer, otherPlayer)}
                muteSpectators={currentGame.muteSpectators}
                numDeckCards={thisPlayer.numDeckCards}
                numMessages={newMessages}
                onManualModeClick={onManualModeClick}
                onMessagesClick={onMessagesClick}
                onCardClick={onCardClick}
                onDragDrop={onDragDrop}
                onDrawPopupChange={handleDrawPopupChange}
                onMenuItemClick={onMenuItemClick}
                onShuffleClick={onShuffleClick}
                onMouseOut={onMouseOut}
                onMouseOver={onMouseOver}
                onMuteClick={onMuteClick}
                onSettingsClick={onSettingsClick}
                showControls={!spectating && manualMode}
                showDeckName={showDeckName(!spectating)}
                showManualMode={!spectating}
                showMessages
                side='bottom'
                size={user.settings.cardSize}
                spectating={spectating}
                stats={thisPlayer.stats}
                tideRequired={thisPlayer.stats.tideRequired || otherPlayer?.stats?.tideRequired}
                user={thisPlayer.user}
            />
        </div>
    );
};

GameBoard.displayName = 'GameBoard';

export default GameBoard;
