import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { withTranslation, Trans } from 'react-i18next';

import ActivePlayerPrompt from './ActivePlayerPrompt';
import CardBack from '../Decks/CardBack';
import CardImage from './CardImage';
import CardMenu from './CardMenu';
import CardZoom from './CardZoom';
import { Constants } from '../../constants';
import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import PlayerBoard from './PlayerBoard';
import PlayerStats from './PlayerStats';
import TimeLimitClock from './TimeLimitClock';
import * as actions from '../../redux/actions';
import withRouter from '../../router/withRouter';

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
        this.onClickTide = this.onClickTide.bind(this);
        this.onClickProphecy = this.onClickProphecy.bind(this);
        this.onProphecyMenuItemClick = this.onProphecyMenuItemClick.bind(this);

        this.state = {
            cardToZoom: null,
            showActionWindowsMenu: false,
            showCardMenu: {},
            showMessages: true,
            lastMessageCount: 0,
            newMessages: 0,
            showModal: false,
            showProphecyMenu: null // UUID of prophecy card whose menu is shown
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

    onClickTide() {
        this.props.sendGameMessage('clickTide');
    }

    onClickProphecy(card) {
        this.props.sendGameMessage('clickProphecy', card.uuid);
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

    onProphecyMenuItemClick(card, menuItem) {
        this.props.sendGameMessage('menuItemClick', card.uuid, menuItem);
        this.setState({ showProphecyMenu: null });
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

    isSpectating() {
        return !this.props.currentGame.players[this.props.user.username];
    }

    renderSidePane(thisPlayer, otherPlayer) {
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
                    {/* Other player's content grouped together */}
                    {otherPlayer && (
                        <>
                            {this.renderToken(otherPlayer)}
                            {this.renderProphecies(otherPlayer)}
                        </>
                    )}

                    {/* Tide centered between players */}
                    {this.renderTide(thisPlayer, otherPlayer)}

                    {/* This player's content grouped together */}
                    {this.renderToken(thisPlayer)}
                    {this.renderProphecies(thisPlayer)}
                </div>
            );
        }
    }

    renderToken(player) {
        if (player.tokenCard) {
            let locale = this.props.i18n.language;
            let img = `/img/cards/${locale === 'en' ? '' : locale}/${player.tokenCard.image}.png`;
            return (
                <img
                    className={`img-fluid normal reference-card`}
                    src={img}
                    onMouseOver={() => {
                        this.onMouseOver({
                            image: <img src={img} className='card-zoom normal' />,
                            size: 'normal'
                        });
                    }}
                    onMouseOut={this.onMouseOut}
                    title={this.props.t(`${player.tokenCard.name}`)}
                />
            );
        }
    }

    renderProphecies(player) {
        if (player.prophecyCards && player.prophecyCards.length > 0) {
            let locale = this.props.i18n.language;
            const prophecyPairs = [];

            // Group prophecies into pairs
            for (let i = 0; i < player.prophecyCards.length; i += 2) {
                const pair = player.prophecyCards.slice(i, i + 2);
                prophecyPairs.push(pair);
            }

            return (
                <div className='prophecy-player-section'>
                    {prophecyPairs.map((pair, pairIndex) => (
                        <div key={`prophecy-pair-${pairIndex}`} className='prophecy-grid'>
                            {pair.map((card) => {
                                // Handle both face-up and face-down prophecy cards
                                let img;
                                if (card.facedown) {
                                    // Non-controlling player sees face-down card
                                    img = Constants.DefaultCard;
                                } else {
                                    // Controlling player sees face-up card
                                    img = `/img/cards/${locale === 'en' ? '' : locale}/${
                                        card.image
                                    }.png`;
                                }

                                // Only the prophecy controller can click prophecies
                                const isController = player.name === this.props.user.username;
                                const isClickable =
                                    isController &&
                                    (card.canActivateProphecy || this.props.currentGame.manualMode);
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
                                                    ? () => this.onCardClick(card)
                                                    : isClickable
                                                    ? () => {
                                                          if (
                                                              this.props.currentGame.manualMode &&
                                                              card.menu &&
                                                              card.menu.length > 0
                                                          ) {
                                                              // In manual mode, show menu if available
                                                              this.setState({
                                                                  showProphecyMenu:
                                                                      this.state
                                                                          .showProphecyMenu ===
                                                                      card.uuid
                                                                          ? null
                                                                          : card.uuid
                                                              });
                                                          } else {
                                                              // Fallback to old prophecy click behavior
                                                              this.onClickProphecy(card);
                                                          }
                                                      }
                                                    : undefined
                                            }
                                            onMouseOver={() => {
                                                this.onMouseOver({
                                                    image: card.facedown ? (
                                                        <img
                                                            src={img}
                                                            className='card-zoom normal'
                                                        />
                                                    ) : (
                                                        <CardImage
                                                            card={{ ...card, location: 'zoom' }}
                                                        />
                                                    ),
                                                    size: 'normal'
                                                });
                                            }}
                                            onMouseOut={this.onMouseOut}
                                            title={
                                                card.facedown
                                                    ? 'Face-down prophecy'
                                                    : this.props.t(`${card.name}`)
                                            }
                                        />

                                        {/* Render prophecy menu if shown */}
                                        {this.state.showProphecyMenu === card.uuid &&
                                            card.menu &&
                                            card.menu.length > 0 && (
                                                <CardMenu
                                                    menu={card.menu}
                                                    onMenuItemClick={(menuItem) => {
                                                        this.onProphecyMenuItemClick(
                                                            card,
                                                            menuItem
                                                        );
                                                    }}
                                                />
                                            )}

                                        {/* Render child cards directly under this prophecy */}
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
                                                                this.onMouseOver({
                                                                    image: (
                                                                        <CardImage
                                                                            card={{
                                                                                ...childCard,
                                                                                location: 'zoom'
                                                                            }}
                                                                        />
                                                                    ),
                                                                    size: 'normal'
                                                                });
                                                            }
                                                        }}
                                                        onMouseOut={this.onMouseOut}
                                                        title={
                                                            isController
                                                                ? this.props.t(`${childCard.name}`)
                                                                : 'Face-down card'
                                                        }
                                                    >
                                                        <CardBack
                                                            deck={player.deckData}
                                                            showDeckName={this.showDeckName(
                                                                !this.isSpectating()
                                                            )}
                                                            zoom={false}
                                                            size={this.props.user.settings.cardSize}
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
    }

    renderTide(thisPlayer, otherPlayer) {
        if (thisPlayer.stats.tideRequired || (otherPlayer && otherPlayer.stats.tideRequired)) {
            let locale = this.props.i18n.language;
            let img = Constants.TideImages.card[locale]
                ? Constants.TideImages.card[locale]
                : Constants.TideImages.card['en'];
            return (
                <img
                    onClick={this.onClickTide}
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
                        this.onMouseOver({
                            image: <img src={img} className='card-zoom normal' />,
                            size: `tide-${thisPlayer.stats.tide}`
                        });
                    }}
                    onMouseOut={this.onMouseOut}
                    title={this.props.t(`${thisPlayer.stats.tide}-tide`)}
                />
            );
        }
    }

    renderBoard(thisPlayer, otherPlayer) {
        return [
            <div key='board-middle' className='board-middle'>
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
                            isSpectating={this.isSpectating()}
                            onCardClick={this.onCardClick}
                            onMenuItemClick={this.onMenuItemClick}
                            onMouseOut={this.onMouseOut}
                            onMouseOver={this.onMouseOver}
                            rowDirection='reverse'
                            tide={otherPlayer?.stats?.tide}
                            user={this.props.user}
                        />
                        <PlayerBoard
                            cardBack={
                                <CardBack
                                    size={this.props.user.settings.cardSize}
                                    deck={thisPlayer.deckData}
                                    showDeckName={this.showDeckName(!this.isSpectating())}
                                />
                            }
                            cardsInPlay={thisPlayer.cardPiles.cardsInPlay}
                            cardSize={this.props.user.settings.cardSize}
                            hand={thisPlayer.cardPiles.hand}
                            isMe={!this.isSpectating()}
                            isSpectating={this.isSpectating()}
                            manualMode={this.props.currentGame.manualMode}
                            onCardClick={this.onCardClick}
                            onDragDrop={this.onDragDrop}
                            onMenuItemClick={this.onMenuItemClick}
                            onMouseOut={this.onMouseOut}
                            onMouseOver={this.onMouseOver}
                            rowDirection='default'
                            tide={thisPlayer.stats.tide}
                            user={this.props.user}
                        />
                    </div>
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
                        activeHouse={otherPlayer.activeHouse}
                        activePlayer={otherPlayer.activePlayer}
                        cardBack={
                            <CardBack
                                size={this.props.user.settings.cardSize}
                                deck={otherPlayer.deckData}
                                showDeckName={this.showDeckName(false)}
                            />
                        }
                        cardPiles={otherPlayer.cardPiles}
                        deck={otherPlayer.deckData}
                        houses={otherPlayer.houses}
                        isMe={false}
                        numDeckCards={otherPlayer.numDeckCards}
                        onCardClick={this.onCardClick}
                        onDragDrop={this.onDragDrop}
                        onDrawPopupChange={this.handleDrawPopupChange}
                        onMenuItemClick={this.onMenuItemClick}
                        onMouseOut={this.onMouseOut}
                        onMouseOver={this.onMouseOver}
                        onShuffleClick={this.onShuffleClick}
                        showDeckName={this.showDeckName(false)}
                        side='top'
                        size={this.props.user.settings.cardSize}
                        spectating={this.isSpectating()}
                        stats={otherPlayer.stats}
                        tideRequired={
                            thisPlayer.stats.tideRequired || otherPlayer?.stats?.tideRequired
                        }
                        user={otherPlayer.user}
                    />
                </div>
                <div className='main-window'>
                    {this.renderBoard(thisPlayer, otherPlayer)}
                    {this.state.cardToZoom && <CardZoom card={this.state.cardToZoom} />}
                    <div className='right-side'>
                        <div className='prompt-area'>
                            <div className='right-side-top'></div>
                            {this.renderSidePane(thisPlayer, otherPlayer)}
                            <div className='inset-pane'>
                                {this.isSpectating() ? (
                                    <div />
                                ) : (
                                    <ActivePlayerPrompt
                                        cards={this.props.cards}
                                        buttons={thisPlayer.buttons}
                                        controls={thisPlayer.controls}
                                        promptText={thisPlayer.menuTitle}
                                        promptTitle={thisPlayer.promptTitle}
                                        onButtonClick={this.onCommand}
                                        onClickTide={this.onClickTide}
                                        onMouseOver={this.onMouseOver}
                                        onMouseOut={this.onMouseOut}
                                        user={this.props.user}
                                        phase={thisPlayer.phase}
                                    />
                                )}
                                {this.getTimer()}
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
                <PlayerStats
                    {...boundActionCreators}
                    activeHouse={thisPlayer.activeHouse}
                    activePlayer={thisPlayer.activePlayer}
                    cardBack={
                        <CardBack
                            size={this.props.user.settings.cardSize}
                            deck={thisPlayer.deckData}
                            showDeckName={this.showDeckName(!this.isSpectating())}
                        />
                    }
                    cardPiles={thisPlayer.cardPiles}
                    deck={thisPlayer.deckData}
                    houses={thisPlayer.houses}
                    isMe={!this.isSpectating()}
                    manualMode={manualMode}
                    matchRecord={this.getMatchRecord(thisPlayer, otherPlayer)}
                    muteSpectators={this.props.currentGame.muteSpectators}
                    numDeckCards={thisPlayer.numDeckCards}
                    numMessages={this.state.newMessages}
                    onManualModeClick={this.onManualModeClick}
                    onMessagesClick={this.onMessagesClick}
                    onCardClick={this.onCardClick}
                    onDragDrop={this.onDragDrop}
                    onDrawPopupChange={this.handleDrawPopupChange}
                    onMenuItemClick={this.onMenuItemClick}
                    onShuffleClick={this.onShuffleClick}
                    onMouseOut={this.onMouseOut}
                    onMouseOver={this.onMouseOver}
                    onMuteClick={this.onMuteClick}
                    onSettingsClick={this.onSettingsClick}
                    showControls={!this.isSpectating() && manualMode}
                    showDeckName={this.showDeckName(!this.isSpectating())}
                    showManualMode={!this.isSpectating()}
                    showMessages
                    side='bottom'
                    size={this.props.user.settings.cardSize}
                    spectating={this.isSpectating()}
                    stats={thisPlayer.stats}
                    tideRequired={thisPlayer.stats.tideRequired || otherPlayer?.stats?.tideRequired}
                    user={thisPlayer.user}
                />
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

export default withTranslation()(
    withRouter(connect(mapStateToProps, mapDispatchToProps, null)(GameBoard))
);
