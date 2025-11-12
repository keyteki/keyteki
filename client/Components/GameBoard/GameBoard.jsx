import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { useTranslation, Trans } from 'react-i18next';

import ActivePlayerPrompt from './ActivePlayerPrompt';
import CardBack from '../Decks/CardBack';
import CardMenu from './CardMenu';
import CardZoom from './CardZoom';
import { Constants } from '../../constants';
import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import PlayerBoard from './PlayerBoard';
import PlayerStats from './PlayerStats';
import TimeLimitClock from './TimeLimitClock';
// Legacy actions import removed; no longer passing bound actions to children

import './GameBoard.scss';

const placeholderPlayer = {
    cardPiles: {
        cardsInPlay: [],
        discard: [],
        hand: [],
        purged: [],
        deck: []
    },
    activePlayer: false,
    numDeckCards: 0,
    stats: {
        keys: { red: false, blue: false, yellow: false }
    },
    houses: [],
    title: null,
    user: null,
    deckData: {}
};

const GameBoard = ({ navigate, sendGameMessage }) => {
    const { t, i18n } = useTranslation();
    // No dispatch needed here after removing bound legacy actions

    const cards = useSelector((state) => state.cards.cards);
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);

    const [cardToZoom, setCardToZoom] = useState(null);
    const [showMessages, setShowMessages] = useState(true);
    const [lastMessageCount, setLastMessageCount] = useState(0);
    const [newMessages, setNewMessages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showProphecyMenu, setShowProphecyMenu] = useState(null);

    useEffect(() => {
        const currentMessageCount = currentGame ? currentGame.messages.length : 0;

        if (showMessages) {
            setLastMessageCount(currentMessageCount);
            setNewMessages(0);
        } else {
            setNewMessages(currentMessageCount - lastMessageCount);
        }
    }, [currentGame, showMessages, lastMessageCount]);

    const onMouseOver = useCallback((card) => {
        if (card.image) {
            setCardToZoom(card);
        }
    }, []);

    const onMouseOut = useCallback(() => {
        setCardToZoom(null);
    }, []);

    const onCardClick = useCallback(
        (card) => {
            sendGameMessage('cardClicked', card.uuid);
        },
        [sendGameMessage]
    );

    const handleDrawPopupChange = useCallback(
        (event) => {
            sendGameMessage('showDrawDeck', event.visible);
        },
        [sendGameMessage]
    );

    const sendChatMessage = useCallback(
        (message) => {
            sendGameMessage('chat', message);
        },
        [sendGameMessage]
    );

    const onShuffleClick = useCallback(() => {
        sendGameMessage('shuffleDeck');
    }, [sendGameMessage]);

    const onDragDrop = useCallback(
        (card, source, target) => {
            sendGameMessage('drop', card.uuid, source, target);
        },
        [sendGameMessage]
    );

    const onClickTide = useCallback(() => {
        sendGameMessage('clickTide');
    }, [sendGameMessage]);

    const onClickProphecy = useCallback(
        (card) => {
            sendGameMessage('clickProphecy', card.uuid);
        },
        [sendGameMessage]
    );

    const getTimer = useCallback(() => {
        let timeLimitClock = null;
        if (currentGame.useGameTimeLimit && currentGame.gameTimeLimitStarted) {
            timeLimitClock = (
                <TimeLimitClock
                    timeLimitStarted={currentGame.gameTimeLimitStarted}
                    timeLimitStartedAt={currentGame.gameTimeLimitStartedAt}
                    timeLimit={currentGame.gameTimeLimitTime}
                />
            );
        }
        return timeLimitClock;
    }, [currentGame]);

    const onCommand = useCallback(
        (command, arg, uuid, method) => {
            let commandArg = arg;
            sendGameMessage(command, commandArg, uuid, method);
        },
        [sendGameMessage]
    );

    const onMenuItemClick = useCallback(
        (card, menuItem) => {
            sendGameMessage('menuItemClick', card.uuid, menuItem);
        },
        [sendGameMessage]
    );

    const onProphecyMenuItemClick = useCallback(
        (card, menuItem) => {
            sendGameMessage('menuItemClick', card.uuid, menuItem);
            setShowProphecyMenu(null);
        },
        [sendGameMessage]
    );

    const onOptionSettingToggle = useCallback(
        (option, value) => {
            sendGameMessage('toggleOptionSetting', option, value);
        },
        [sendGameMessage]
    );

    const onMuteClick = useCallback(() => {
        sendGameMessage('toggleMuteSpectators');
    }, [sendGameMessage]);

    const onSettingsClick = useCallback(() => {
        setShowModal(true);
    }, []);

    const onMessagesClick = useCallback(() => {
        const showState = !showMessages;

        setShowMessages(showState);

        if (showState) {
            setNewMessages(0);
            setLastMessageCount(currentGame.messages.length);
        }
    }, [showMessages, currentGame]);

    const onManualModeClick = useCallback(
        (event) => {
            event.preventDefault();
            sendGameMessage('toggleManualMode');
        },
        [sendGameMessage]
    );

    const defaultPlayerInfo = useCallback((source) => {
        let player = Object.assign({}, placeholderPlayer, source);
        player.cardPiles = Object.assign({}, placeholderPlayer.cardPiles, player.cardPiles);
        return player;
    }, []);

    const getMatchRecord = useCallback((thisPlayer, otherPlayer) => {
        return {
            thisPlayer: {
                name: thisPlayer.name,
                wins: thisPlayer.wins
            },
            otherPlayer: {
                name: otherPlayer.name ? otherPlayer.name : 'Noone',
                wins: otherPlayer.wins ? otherPlayer.wins : 0
            }
        };
    }, []);

    const showDeckName = useCallback(
        (isMe) => {
            return !((currentGame.gameFormat === 'sealed' && !isMe) || currentGame.hideDeckLists);
        },
        [currentGame]
    );

    const isSpectating = useCallback(() => {
        return !currentGame.players[user.username];
    }, [currentGame, user]);

    const renderToken = useCallback(
        (player) => {
            if (player.tokenCard) {
                let locale = i18n.language;
                let img = `/img/cards/${locale === 'en' ? '' : locale}/${
                    player.tokenCard.image
                }.png`;
                return (
                    <img
                        className={`img-fluid normal reference-card`}
                        src={img}
                        onMouseOver={() => {
                            onMouseOver({
                                image: <img src={img} className='card-zoom normal' />,
                                size: 'normal'
                            });
                        }}
                        onMouseOut={onMouseOut}
                        title={t(`${player.tokenCard.name}`)}
                    />
                );
            }
        },
        [i18n.language, onMouseOver, onMouseOut, t]
    );

    const renderProphecies = useCallback(
        (player) => {
            if (player.prophecyCards && player.prophecyCards.length > 0) {
                let locale = i18n.language;
                const prophecyPairs = [];

                for (let i = 0; i < player.prophecyCards.length; i += 2) {
                    const pair = player.prophecyCards.slice(i, i + 2);
                    prophecyPairs.push(pair);
                }

                return (
                    <div className='prophecy-player-section'>
                        {prophecyPairs.map((pair, pairIndex) => (
                            <div key={`prophecy-pair-${pairIndex}`} className='prophecy-grid'>
                                {pair.map((card) => {
                                    let img;
                                    if (card.facedown) {
                                        img = Constants.DefaultCard;
                                    } else {
                                        img = `/img/cards/${locale === 'en' ? '' : locale}/${
                                            card.image
                                        }.png`;
                                    }

                                    const isController = player.name === user.username;
                                    const isClickable =
                                        isController &&
                                        (card.canActivateProphecy || currentGame.manualMode);
                                    const isActive = card.activeProphecy;
                                    const className = `img-fluid normal reference-card prophecy-card ${
                                        isActive ? 'active' : 'inactive'
                                    } ${isClickable ? 'clickable' : ''} ${
                                        !isActive && card.canActivateProphecy ? 'can-activate' : ''
                                    }`;

                                    return (
                                        <div key={card.uuid} className='prophecy-card-container'>
                                            <img
                                                className={className}
                                                src={img}
                                                onClick={
                                                    card.selectable
                                                        ? () => onCardClick(card)
                                                        : isClickable
                                                        ? () => {
                                                              if (
                                                                  currentGame.manualMode &&
                                                                  card.menu &&
                                                                  card.menu.length > 0
                                                              ) {
                                                                  setShowProphecyMenu(
                                                                      showProphecyMenu === card.uuid
                                                                          ? null
                                                                          : card.uuid
                                                                  );
                                                              } else {
                                                                  onClickProphecy(card);
                                                              }
                                                          }
                                                        : undefined
                                                }
                                                onMouseOver={() => {
                                                    onMouseOver({
                                                        image: (
                                                            <img
                                                                src={img}
                                                                className='card-zoom normal'
                                                            />
                                                        ),
                                                        size: 'normal'
                                                    });
                                                }}
                                                onMouseOut={onMouseOut}
                                                title={
                                                    card.facedown
                                                        ? 'Face-down prophecy'
                                                        : t(`${card.name}`)
                                                }
                                            />

                                            {showProphecyMenu === card.uuid &&
                                                card.menu &&
                                                card.menu.length > 0 && (
                                                    <CardMenu
                                                        menu={card.menu}
                                                        onMenuItemClick={(menuItem) => {
                                                            onProphecyMenuItemClick(card, menuItem);
                                                        }}
                                                    />
                                                )}

                                            {isActive &&
                                                card.childCards &&
                                                card.childCards.length > 0 &&
                                                card.childCards.map((childCard, childIndex) => {
                                                    return (
                                                        <div
                                                            key={`${card.uuid}-child-${childIndex}`}
                                                            className='child-card-under-prophecy'
                                                            style={{
                                                                top: `${35 + childIndex * 4}px`,
                                                                left: `${childIndex * 2}px`
                                                            }}
                                                            onMouseOver={() => {
                                                                if (isController) {
                                                                    const faceUpImg = `/img/cards/${
                                                                        locale === 'en'
                                                                            ? ''
                                                                            : locale
                                                                    }/${childCard.image}.png`;
                                                                    onMouseOver({
                                                                        image: (
                                                                            <img
                                                                                src={faceUpImg}
                                                                                className='card-zoom normal'
                                                                            />
                                                                        ),
                                                                        size: 'normal'
                                                                    });
                                                                }
                                                            }}
                                                            onMouseOut={onMouseOut}
                                                            title={
                                                                isController
                                                                    ? t(`${childCard.name}`)
                                                                    : 'Face-down card'
                                                            }
                                                        >
                                                            <CardBack
                                                                deck={player.deckData}
                                                                showDeckName={showDeckName(
                                                                    !isSpectating()
                                                                )}
                                                                zoom={false}
                                                                size={user.settings.cardSize}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                );
            }
        },
        [
            i18n.language,
            user,
            currentGame,
            showProphecyMenu,
            onCardClick,
            onClickProphecy,
            onMouseOver,
            onMouseOut,
            onProphecyMenuItemClick,
            showDeckName,
            isSpectating,
            t
        ]
    );

    const renderTide = useCallback(
        (thisPlayer, otherPlayer) => {
            if (thisPlayer.stats.tideRequired || (otherPlayer && otherPlayer.stats.tideRequired)) {
                let locale = i18n.language;
                let img = Constants.TideImages.card[locale]
                    ? Constants.TideImages.card[locale]
                    : Constants.TideImages.card['en'];
                return (
                    <img
                        onClick={onClickTide}
                        className={`img-fluid normal reference-card tide-card tide-${
                            thisPlayer.stats.tide
                        }
                        ${
                            thisPlayer.activeHouse && thisPlayer.canRaiseTide
                                ? 'can-raise-tide'
                                : ''
                        }`}
                        src={img}
                        onMouseOver={() => {
                            onMouseOver({
                                image: <img src={img} className='card-zoom normal' />,
                                size: `tide-${thisPlayer.stats.tide}`
                            });
                        }}
                        onMouseOut={onMouseOut}
                        title={t(`${thisPlayer.stats.tide}-tide`)}
                    />
                );
            }
        },
        [i18n.language, onClickTide, onMouseOver, onMouseOut, t]
    );

    const renderSidePane = useCallback(
        (thisPlayer, otherPlayer) => {
            if (
                thisPlayer.stats.tideRequired ||
                (otherPlayer && otherPlayer.stats.tideRequired) ||
                thisPlayer.tokenCard ||
                (otherPlayer && otherPlayer.tokenCard) ||
                (thisPlayer.prophecyCards && thisPlayer.prophecyCards.length > 0) ||
                (otherPlayer && otherPlayer.prophecyCards && otherPlayer.prophecyCards.length > 0)
            ) {
                return (
                    <div className='reference-card-pane'>
                        {otherPlayer && (
                            <>
                                {renderToken(otherPlayer)}
                                {renderProphecies(otherPlayer)}
                            </>
                        )}
                        {renderTide(thisPlayer, otherPlayer)}
                        {renderToken(thisPlayer)}
                        {renderProphecies(thisPlayer)}
                    </div>
                );
            }
        },
        [renderToken, renderProphecies, renderTide]
    );

    const renderBoard = useCallback(
        (thisPlayer, otherPlayer) => {
            return [
                <div key='board-middle' className='board-middle'>
                    <div className='board-inner'>
                        <div className='play-area'>
                            <PlayerBoard
                                cardBack={
                                    <CardBack
                                        size={user.settings.cardSize}
                                        deck={otherPlayer.deckData}
                                        showDeckName={showDeckName(false)}
                                    />
                                }
                                cardsInPlay={otherPlayer.cardPiles.cardsInPlay}
                                isSpectating={isSpectating()}
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
                                        showDeckName={showDeckName(!isSpectating())}
                                    />
                                }
                                cardsInPlay={thisPlayer.cardPiles.cardsInPlay}
                                cardSize={user.settings.cardSize}
                                hand={thisPlayer.cardPiles.hand}
                                isMe={!isSpectating()}
                                isSpectating={isSpectating()}
                                manualMode={currentGame.manualMode}
                                onCardClick={onCardClick}
                                onDragDrop={onDragDrop}
                                onMenuItemClick={onMenuItemClick}
                                onMouseOut={onMouseOut}
                                onMouseOver={onMouseOver}
                                rowDirection='default'
                                tide={thisPlayer.stats.tide}
                                user={user}
                            />
                        </div>
                    </div>
                </div>
            ];
        },
        [
            user,
            currentGame,
            showDeckName,
            isSpectating,
            onCardClick,
            onMenuItemClick,
            onMouseOut,
            onMouseOver,
            onDragDrop
        ]
    );

    if (Object.values(cards).length === 0 || !currentGame?.started) {
        return (
            <div>
                <Trans>Waiting for server...</Trans>
            </div>
        );
    }

    if (!user) {
        navigate('/');
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

    thisPlayer = defaultPlayerInfo(thisPlayer);
    otherPlayer = defaultPlayerInfo(otherPlayer);

    let boardClass = classNames('game-board', {
        'select-cursor': thisPlayer && thisPlayer.selectCard
    });

    let manualMode = currentGame.manualMode;

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
                    spectating={isSpectating()}
                    stats={otherPlayer.stats}
                    tideRequired={thisPlayer.stats.tideRequired || otherPlayer?.stats?.tideRequired}
                    user={otherPlayer.user}
                />
            </div>
            <div className='main-window'>
                {renderBoard(thisPlayer, otherPlayer)}
                {cardToZoom && <CardZoom card={cardToZoom} />}
                <div className='right-side'>
                    <div className='prompt-area'>
                        <div className='right-side-top'></div>
                        {renderSidePane(thisPlayer, otherPlayer)}
                        <div className='inset-pane'>
                            {isSpectating() ? (
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
                            {getTimer()}
                        </div>
                    </div>
                    {showMessages && (
                        <div className='gamechat'>
                            <GameChat
                                key='gamechat'
                                messages={currentGame.messages}
                                onCardMouseOut={onMouseOut}
                                onCardMouseOver={onMouseOver}
                                onSendChat={sendChatMessage}
                                muted={isSpectating() && currentGame.muteSpectators}
                            />
                        </div>
                    )}
                </div>
            </div>
            <PlayerStats
                activeHouse={thisPlayer.activeHouse}
                activePlayer={thisPlayer.activePlayer}
                cardBack={
                    <CardBack
                        size={user.settings.cardSize}
                        deck={thisPlayer.deckData}
                        showDeckName={showDeckName(!isSpectating())}
                    />
                }
                cardPiles={thisPlayer.cardPiles}
                deck={thisPlayer.deckData}
                houses={thisPlayer.houses}
                isMe={!isSpectating()}
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
                showControls={!isSpectating() && manualMode}
                showDeckName={showDeckName(!isSpectating())}
                showManualMode={!isSpectating()}
                showMessages
                side='bottom'
                size={user.settings.cardSize}
                spectating={isSpectating()}
                stats={thisPlayer.stats}
                tideRequired={thisPlayer.stats.tideRequired || otherPlayer?.stats?.tideRequired}
                user={thisPlayer.user}
            />
        </div>
    );
};

GameBoard.displayName = 'GameBoard';
GameBoard.propTypes = {
    navigate: PropTypes.func,
    sendGameMessage: PropTypes.func
};

export default GameBoard;
