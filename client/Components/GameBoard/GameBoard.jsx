import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { withTranslation, Trans } from 'react-i18next';

import PlayerStats from './PlayerStats';
import PlayerRow from './PlayerRow';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import CardZoom from './CardZoom';
import PlayerBoard from './PlayerBoard';
import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import Droppable from './Droppable';
import TimeLimitClock from './TimeLimitClock';
import * as actions from '../../redux/actions';

import './GameBoard.scss';

const placeholderPlayer = {
    cardPiles: {
        cardsInPlay: [],
        discard: [],
        hand: [],
        purged: [],
        deck: []
    },
    faction: null,
    activePlayer: false,
    numDeckCards: 0,
    stats: {
        keys: { red: false, blue: false, yellow: false }
    },
    houses: [],
    deckCards: [],
    title: null,
    user: null,
    deckData: {}
};

export class GameBoard extends React.Component {
    constructor(props) {
        super(props);

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.handleDrawPopupChange = this.handleDrawPopupChange.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onCommand = this.onCommand.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.onSettingsClick = this.onSettingsClick.bind(this);
        this.onMessagesClick = this.onMessagesClick.bind(this);
        this.onManualModeClick = this.onManualModeClick.bind(this);
        this.onMuteClick = this.onMuteClick.bind(this);

        this.state = {
            cardToZoom: undefined,
            showActionWindowsMenu: false,
            showCardMenu: {},
            showMessages: true,
            lastMessageCount: 0,
            newMessages: 0,
            showModal: false
        };
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        let lastMessageCount = this.state.lastMessageCount;
        let currentMessageCount = props.currentGame ? props.currentGame.messages.length : 0;

        if (this.state.showMessages) {
            this.setState({ lastMessageCount: currentMessageCount, newMessages: 0 });
        } else {
            this.setState({ newMessages: currentMessageCount - lastMessageCount });
        }
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    onMouseOut() {
        this.props.clearZoom();
    }

    onCardClick(card) {
        this.props.sendGameMessage('cardClicked', card.uuid);
    }

    handleDrawPopupChange(event) {
        this.props.sendGameMessage('showDrawDeck', event.visible);
    }

    sendChatMessage(message) {
        this.props.sendGameMessage('chat', message);
    }

    onShuffleClick() {
        this.props.sendGameMessage('shuffleDeck');
    }

    onDragDrop(card, source, target) {
        this.props.sendGameMessage('drop', card.uuid, source, target);
    }

    getTimer() {
        let timeLimitClock = null;
        if (
            this.props.currentGame.useGameTimeLimit &&
            this.props.currentGame.gameTimeLimitStarted
        ) {
            timeLimitClock = (
                <TimeLimitClock
                    timeLimitStarted={this.props.currentGame.gameTimeLimitStarted}
                    timeLimitStartedAt={this.props.currentGame.gameTimeLimitStartedAt}
                    timeLimit={this.props.currentGame.gameTimeLimitTime}
                />
            );
        }

        return timeLimitClock;
    }

    onCommand(command, arg, uuid, method) {
        let commandArg = arg;

        this.props.sendGameMessage(command, commandArg, uuid, method);
    }

    onMenuItemClick(card, menuItem) {
        this.props.sendGameMessage('menuItemClick', card.uuid, menuItem);
    }

    onOptionSettingToggle(option, value) {
        this.props.sendGameMessage('toggleOptionSetting', option, value);
    }

    onMuteClick() {
        this.props.sendGameMessage('toggleMuteSpectators');
    }

    onSettingsClick() {
        this.setState({ showModal: true });
    }

    onMessagesClick() {
        const showState = !this.state.showMessages;

        let newState = {
            showMessages: showState
        };

        if (showState) {
            newState.newMessages = 0;
            newState.lastMessageCount = this.props.currentGame.messages.length;
        }

        this.setState(newState);
    }

    onManualModeClick(event) {
        event.preventDefault();
        this.props.sendGameMessage('toggleManualMode');
    }

    defaultPlayerInfo(source) {
        let player = Object.assign({}, placeholderPlayer, source);
        player.cardPiles = Object.assign({}, placeholderPlayer.cardPiles, player.cardPiles);
        return player;
    }

    getMatchRecord(thisPlayer, otherPlayer) {
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
    }

    renderBoard(thisPlayer, otherPlayer) {
        let spectating = !this.props.currentGame.players[this.props.user.username];

        return [
            <div key='board-middle' className='board-middle'>
                <div className='player-home-row'>
                    <PlayerRow
                        player={2}
                        cardBackUrl={this.props.player2CardBack}
                        faction={otherPlayer.faction}
                        archives={otherPlayer.cardPiles.archives}
                        hand={otherPlayer.cardPiles.hand}
                        isMe={false}
                        hideDecklist={this.props.currentGame.hideDecklists}
                        language={this.props.i18n.language}
                        deckData={otherPlayer.deckData}
                        deckCards={otherPlayer.deckCards}
                        drawDeck={otherPlayer.cardPiles.deck}
                        houses={otherPlayer.houses}
                        numDeckCards={otherPlayer.numDeckCards}
                        discard={otherPlayer.cardPiles.discard}
                        onCardClick={this.onCardClick}
                        onMouseOver={this.onMouseOver}
                        onMouseOut={this.onMouseOut}
                        purgedPile={otherPlayer.cardPiles.purged}
                        keys={otherPlayer.stats.keys}
                        spectating={spectating}
                        title={otherPlayer.title}
                        side='top'
                        username={this.props.user.username}
                        cardSize={this.props.user.settings.cardSize}
                    />
                </div>
                <div className='board-inner'>
                    <div className='play-area'>
                        <PlayerBoard
                            cardBackUrl={this.props.player2CardBack}
                            cardsInPlay={otherPlayer.cardPiles.cardsInPlay}
                            onCardClick={this.onCardClick}
                            onMenuItemClick={this.onMenuItemClick}
                            onMouseOut={this.onMouseOut}
                            onMouseOver={this.onMouseOver}
                            rowDirection='reverse'
                            user={this.props.user}
                        />
                        <Droppable
                            onDragDrop={this.onDragDrop}
                            source='play area'
                            manualMode={this.props.currentGame.manualMode}
                        >
                            <PlayerBoard
                                cardBackUrl={this.props.player1CardBack}
                                cardsInPlay={thisPlayer.cardPiles.cardsInPlay}
                                manualMode={this.props.currentGame.manualMode}
                                onCardClick={this.onCardClick}
                                onMenuItemClick={this.onMenuItemClick}
                                onMouseOut={this.onMouseOut}
                                onMouseOver={this.onMouseOver}
                                rowDirection='default'
                                user={this.props.user}
                            />
                        </Droppable>
                    </div>
                </div>
                {this.getTimer()}
                <div className='player-home-row our-side'>
                    <PlayerRow
                        isMe={!spectating}
                        player={1}
                        hideDecklist={this.props.currentGame.hideDecklists && spectating}
                        cardBackUrl={this.props.player1CardBack}
                        archives={thisPlayer.cardPiles.archives}
                        language={this.props.i18n.language}
                        deckData={thisPlayer.deckData}
                        deckCards={thisPlayer.deckCards}
                        drawDeck={thisPlayer.cardPiles.deck}
                        houses={thisPlayer.houses}
                        faction={thisPlayer.faction}
                        hand={thisPlayer.cardPiles.hand}
                        onCardClick={this.onCardClick}
                        onMouseOver={this.onMouseOver}
                        onMouseOut={this.onMouseOut}
                        numDeckCards={thisPlayer.numDeckCards}
                        keys={thisPlayer.stats.keys}
                        onDrawPopupChange={this.handleDrawPopupChange}
                        onShuffleClick={this.onShuffleClick}
                        purgedPile={thisPlayer.cardPiles.purged}
                        onDragDrop={this.onDragDrop}
                        discard={thisPlayer.cardPiles.discard}
                        showDeck={thisPlayer.showDeck}
                        spectating={spectating}
                        title={thisPlayer.title}
                        onMenuItemClick={this.onMenuItemClick}
                        cardSize={this.props.user.settings.cardSize}
                        manualMode={this.props.currentGame.manualMode}
                        side='bottom'
                    />
                </div>
            </div>
        ];
    }

    render() {
        if (Object.values(this.props.cards).length === 0 || !this.props.currentGame?.started) {
            return (
                <div>
                    <Trans>Waiting for server...</Trans>
                </div>
            );
        }

        if (!this.props.user) {
            this.props.navigate('/');
            return (
                <div>
                    <Trans>You are not logged in, redirecting...</Trans>
                </div>
            );
        }

        let spectating = !this.props.currentGame.players[this.props.user.username];
        let thisPlayer = this.props.currentGame.players[this.props.user.username];
        if (!thisPlayer) {
            thisPlayer = Object.values(this.props.currentGame.players)[0];
        }

        if (!thisPlayer) {
            return (
                <div>
                    <Trans>Waiting for game to have players or close...</Trans>
                </div>
            );
        }

        let otherPlayer = Object.values(this.props.currentGame.players).find((player) => {
            return player.name !== thisPlayer.name;
        });

        // Default any missing information
        thisPlayer = this.defaultPlayerInfo(thisPlayer);
        otherPlayer = this.defaultPlayerInfo(otherPlayer);

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

        let boardClass = classNames('game-board', {
            'select-cursor': thisPlayer && thisPlayer.selectCard
        });

        let manualMode = this.props.currentGame.manualMode;
        let cardToZoom;

        if (this.props.cardToZoom && this.props.cards[this.props.cardToZoom.code]) {
            cardToZoom = this.props.cards[this.props.cardToZoom.code];
        } else if (this.props.cardToZoom) {
            cardToZoom = this.props.cardToZoom;
        }

        return (
            <div className={boardClass}>
                {this.state.showModal && (
                    <GameConfigurationModal
                        optionSettings={thisPlayer.optionSettings}
                        onOptionSettingToggle={this.onOptionSettingToggle.bind(this)}
                        onClose={() => this.setState({ showModal: false })}
                    />
                )}
                <div className='stats-top'>
                    <PlayerStats
                        stats={otherPlayer.stats}
                        houses={otherPlayer.houses}
                        activeHouse={otherPlayer.activeHouse}
                        user={otherPlayer.user}
                        activePlayer={otherPlayer.activePlayer}
                    />
                </div>
                <div className='main-window'>
                    {this.renderBoard(thisPlayer, otherPlayer)}
                    {cardToZoom && (
                        <CardZoom
                            imageUrl={cardToZoom ? `/img/cards/${cardToZoom.image}.png` : ''}
                            cardName={cardToZoom ? cardToZoom.name : null}
                            card={cardToZoom}
                        />
                    )}
                    <div className='right-side'>
                        <div className='prompt-area'>
                            <div className='inset-pane'>
                                <ActivePlayerPrompt
                                    cards={this.props.cards}
                                    buttons={thisPlayer.buttons}
                                    controls={thisPlayer.controls}
                                    promptText={thisPlayer.menuTitle}
                                    promptTitle={thisPlayer.promptTitle}
                                    onButtonClick={this.onCommand}
                                    onMouseOver={this.onMouseOver}
                                    onMouseOut={this.onMouseOut}
                                    user={this.props.user}
                                    phase={thisPlayer.phase}
                                />
                            </div>
                        </div>
                        {this.state.showMessages && (
                            <div className='gamechat'>
                                <GameChat
                                    key='gamechat'
                                    messages={this.props.currentGame.messages}
                                    onCardMouseOut={this.onMouseOut}
                                    onCardMouseOver={this.onMouseOver}
                                    onSendChat={this.sendChatMessage}
                                    muted={spectating && this.props.currentGame.muteSpectators}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <PlayerStats
                        {...boundActionCreators}
                        activeHouse={thisPlayer.activeHouse}
                        activePlayer={thisPlayer.activePlayer}
                        houses={thisPlayer.houses}
                        manualModeEnabled={manualMode}
                        matchRecord={this.getMatchRecord(thisPlayer, otherPlayer)}
                        muteSpectators={this.props.currentGame.muteSpectators}
                        numMessages={this.state.newMessages}
                        onManualModeClick={this.onManualModeClick}
                        onMessagesClick={this.onMessagesClick}
                        onMuteClick={this.onMuteClick}
                        onSettingsClick={this.onSettingsClick}
                        showControls={!spectating && manualMode}
                        showManualMode={!spectating}
                        showMessages
                        stats={thisPlayer.stats}
                        user={thisPlayer.user}
                    />
                </div>
            </div>
        );
    }
}

GameBoard.displayName = 'GameBoard';
GameBoard.propTypes = {
    cardToZoom: PropTypes.object,
    cards: PropTypes.object,
    clearZoom: PropTypes.func,
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
    dispatch: PropTypes.func,
    i18n: PropTypes.object,
    navigate: PropTypes.func,
    packs: PropTypes.array,
    player1CardBack: PropTypes.string,
    player2CardBack: PropTypes.string,
    restrictedList: PropTypes.array,
    sendGameMessage: PropTypes.func,
    socket: PropTypes.object,
    t: PropTypes.func,
    user: PropTypes.object,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard,
        cards: state.cards.cards,
        currentGame: state.lobby.currentGame,
        packs: state.cards.packs,
        player1CardBack: state.cards.player1CardBack,
        player2CardBack: state.cards.player2CardBack,
        restrictedList: state.cards.restrictedList,
        socket: state.lobby.socket,
        user: state.auth.user
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps, null)(GameBoard));
