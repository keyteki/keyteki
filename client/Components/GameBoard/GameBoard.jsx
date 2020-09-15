import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { withTranslation, Trans } from 'react-i18next';

import ActivePlayerPrompt from './ActivePlayerPrompt';
import CardBack from '../Decks/CardBack';
import CardZoom from './CardZoom';
import Droppable from './Droppable';
import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import IdentityCard from './IdentityCard';
import PlayerBoard from './PlayerBoard';
import PlayerRow from './PlayerRow';
import PlayerStats from './PlayerStats';
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
            cardToZoom: null,
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
        if (card.image) {
            this.setState({ cardToZoom: card });
        }
    }

    onMouseOut() {
        this.setState({ cardToZoom: null });
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

    showDeckName(isMe) {
        return !(
            (this.props.currentGame.gameFormat === 'sealed' && !isMe) ||
            this.props.currentGame.hideDeckLists
        );
    }

    getDeckListCard(deckData, isMe) {
        if (this.showDeckName(isMe)) {
            return (
                <IdentityCard
                    className={`identity vertical ${this.props.user.settings.cardSize}`}
                    deck={deckData}
                    gameFormat={this.props.currentGame.gameFormat}
                    hideDeckLists={this.props.currentGame.hideDeckLists}
                    isMe={isMe}
                    size={this.props.user.settings.cardSize}
                    onMouseOut={this.onMouseOut}
                    onMouseOver={this.onMouseOver}
                />
            );
        } else {
            return (
                <div className='card-wrapper'>
                    <div className='card-frame'>
                        <div className={`game-card vertical ${this.props.user.settings.cardSize}`}>
                            <CardBack
                                deck={deckData}
                                size={this.props.user.settings.cardSize}
                                showDeckName={
                                    isMe
                                        ? !this.props.currentGame.hideDeckLists
                                        : this.showDeckName(isMe)
                                }
                                zoom={false}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    }

    isSpectating() {
        return !this.props.currentGame.players[this.props.user.username];
    }

    renderBoard(thisPlayer, otherPlayer) {
        return [
            <div key='board-middle' className='board-middle'>
                <div className='player-home-row'>
                    <PlayerRow
                        archives={otherPlayer.cardPiles.archives}
                        cardSize={this.props.user.settings.cardSize}
                        cardBack={
                            <CardBack
                                size={this.props.user.settings.cardSize}
                                deck={otherPlayer.deckData}
                                showDeckName={this.showDeckName(false)}
                            />
                        }
                        deckList={this.getDeckListCard(otherPlayer.deckData, false)}
                        discard={otherPlayer.cardPiles.discard}
                        drawDeck={otherPlayer.cardPiles.deck}
                        hand={otherPlayer.cardPiles.hand}
                        houses={otherPlayer.houses}
                        isMe={false}
                        keys={otherPlayer.stats.keys}
                        numDeckCards={otherPlayer.numDeckCards}
                        onCardClick={this.onCardClick}
                        onMouseOut={this.onMouseOut}
                        onMouseOver={this.onMouseOver}
                        purgedPile={otherPlayer.cardPiles.purged}
                        side='top'
                        spectating={this.isSpectating()}
                        title={otherPlayer.title}
                        username={this.props.user.username}
                    />
                </div>
                <div className='board-inner'>
                    <div className='play-area'>
                        <PlayerBoard
                            cardBack={
                                <CardBack
                                    size={this.props.user.settings.cardSize}
                                    deck={otherPlayer.deckData}
                                    showDeckName={this.showDeckName(false)}
                                />
                            }
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
                                cardBack={
                                    <CardBack
                                        size={this.props.user.settings.cardSize}
                                        deck={thisPlayer.deckData}
                                        showDeckName={this.showDeckName(!this.isSpectating())}
                                    />
                                }
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
                        archives={thisPlayer.cardPiles.archives}
                        cardSize={this.props.user.settings.cardSize}
                        cardBack={
                            <CardBack
                                size={this.props.user.settings.cardSize}
                                deck={thisPlayer.deckData}
                                showDeckName={this.showDeckName(!this.isSpectating())}
                            />
                        }
                        deckList={this.getDeckListCard(thisPlayer.deckData, !this.isSpectating())}
                        discard={thisPlayer.cardPiles.discard}
                        drawDeck={thisPlayer.cardPiles.deck}
                        hand={thisPlayer.cardPiles.hand}
                        houses={thisPlayer.houses}
                        isMe={!this.isSpectating()}
                        keys={thisPlayer.stats.keys}
                        manualMode={this.props.currentGame.manualMode}
                        numDeckCards={thisPlayer.numDeckCards}
                        onCardClick={this.onCardClick}
                        onDragDrop={this.onDragDrop}
                        onDrawPopupChange={this.handleDrawPopupChange}
                        onMenuItemClick={this.onMenuItemClick}
                        onMouseOut={this.onMouseOut}
                        onMouseOver={this.onMouseOver}
                        onShuffleClick={this.onShuffleClick}
                        player={1}
                        purgedPile={thisPlayer.cardPiles.purged}
                        showDeck={thisPlayer.showDeck}
                        side='bottom'
                        spectating={this.isSpectating()}
                        title={thisPlayer.title}
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
                    {this.state.cardToZoom && <CardZoom card={this.state.cardToZoom} />}
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
                                    muted={
                                        this.isSpectating() && this.props.currentGame.muteSpectators
                                    }
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
                        showControls={!this.isSpectating() && manualMode}
                        showManualMode={!this.isSpectating()}
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
    cards: PropTypes.object,
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
    dispatch: PropTypes.func,
    i18n: PropTypes.object,
    navigate: PropTypes.func,
    packs: PropTypes.array,
    restrictedList: PropTypes.array,
    sendGameMessage: PropTypes.func,
    socket: PropTypes.object,
    t: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards,
        currentGame: state.lobby.currentGame,
        packs: state.cards.packs,
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
