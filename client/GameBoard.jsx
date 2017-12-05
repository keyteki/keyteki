import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import _ from 'underscore';
import $ from 'jquery';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';
import Draggable from 'react-draggable';

import PlayerStatsBox from './GameComponents/PlayerStatsBox.jsx';
import PlayerStatsRow from './GameComponents/PlayerStatsRow.jsx';
import PlayerHand from './GameComponents/PlayerHand.jsx';
import DynastyRow from './GameComponents/DynastyRow.jsx';
import StrongholdRow from './GameComponents/StrongholdRow.jsx';
import Ring from './GameComponents/Ring.jsx';
import HonorFan from './GameComponents/HonorFan.jsx';
import ActivePlayerPrompt from './GameComponents/ActivePlayerPrompt.jsx';
import CardZoom from './GameComponents/CardZoom.jsx';
import Card from './GameComponents/Card.jsx';
import Chat from './GameComponents/Chat.jsx';
import Controls from './GameComponents/Controls.jsx';
import CardPile from './GameComponents/CardPile.jsx';
import GameConfiguration from './GameComponents/GameConfiguration.jsx';
import { tryParseJSON } from './util.js';

import * as actions from './actions';

export class InnerGameBoard extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onRingClick = this.onRingClick.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.onConflictClick = this.onConflictClick.bind(this);
        this.onDynastyClick = this.onDynastyClick.bind(this);
        this.onConflictTopCardClick = this.onConflictTopCardClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onCommand = this.onCommand.bind(this);
        this.onConcedeClick = this.onConcedeClick.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.onConflictShuffleClick = this.onConflictShuffleClick.bind(this);
        this.onDynastyShuffleClick = this.onDynastyShuffleClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.onRingMenuItemClick = this.onRingMenuItemClick.bind(this);
        this.onManualModeClick = this.onManualModeClick.bind(this);
        this.onSettingsClick = this.onSettingsClick.bind(this);
        this.onToggleChatClick = this.onToggleChatClick.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        this.state = {
            cardToZoom: undefined,
            showChat: true,
            showChatAlert: false,
            showConflictDeck: false,
            showDynastyDeck: false,
            spectating: true,
            showActionWindowsMenu: false,
            showCardMenu: {}
        };
    }

    componentDidMount() {
        this.updateContextMenu(this.props);
    }

    componentWillReceiveProps(props) {
        this.updateContextMenu(props);
        this.notifyOfNewMessages(props);
    }

    notifyOfNewMessages({ currentGame }) {
        if(this.props.currentGame && !this.state.showChat) {
            const currentLength = this.getMessagesFromPlayers(this.props.currentGame.messages || []).length;

            if(currentLength < this.getMessagesFromPlayers(currentGame.messages || []).length) {
                this.setState({ showChatAlert: true });
            }
        }
    }

    getMessagesFromPlayers(messages) {
        return messages.filter(
            (message) => (message.message instanceof Array) && message.message.some((fragment) => !!fragment.name)
        );
    }

    updateContextMenu(props) {
        if(!props.currentGame) {
            return;
        }

        let thisPlayer = props.currentGame.players[props.username];

        if(thisPlayer) {
            this.setState({ spectating: false });
        } else {
            this.setState({ spectating: true });
        }

        if(thisPlayer && thisPlayer.selectCard) {
            $('body').addClass('select-cursor');
        } else {
            $('body').removeClass('select-cursor');
        }

        let menuOptions = [
            { text: 'Leave Game', onClick: this.onLeaveClick }
        ];

        if(props.currentGame && props.currentGame.started) {
            if(_.find(props.currentGame.players, p => {
                return p.name === props.username;
            })) {
                menuOptions.unshift({ text: 'Concede', onClick: this.onConcedeClick });
            }

            let spectators = _.map(props.currentGame.spectators, spectator => {
                return <li key={ spectator.id }>{ spectator.name }</li>;
            });

            let spectatorPopup = (
                <ul className='spectators-popup absolute-panel'>
                    { spectators }
                </ul>
            );

            menuOptions.unshift({ text: 'Spectators: ' + props.currentGame.spectators.length, popup: spectatorPopup });

            this.setContextMenu(menuOptions);
        } else {
            this.setContextMenu([]);
        }
    }

    setContextMenu(menu) {
        if(this.props.setContextMenu) {
            this.props.setContextMenu(menu);
        }
    }

    onConcedeClick() {
        this.props.sendGameMessage('concede');
    }

    isGameActive() {
        if(!this.props.currentGame) {
            return false;
        }

        if(this.props.currentGame.winner) {
            return false;
        }

        let thisPlayer = this.props.currentGame.players[this.props.username];
        if(!thisPlayer) {
            thisPlayer = _.toArray(this.props.currentGame.players)[0];
        }

        let otherPlayer = _.find(this.props.currentGame.players, player => {
            return player.name !== thisPlayer.name;
        });

        if(!otherPlayer) {
            return false;
        }

        if(otherPlayer.disconnected || otherPlayer.left) {
            return false;
        }

        return true;
    }

    onLeaveClick() {
        if(!this.state.spectating && this.isGameActive()) {
            toastr.confirm('Your game is not finished, are you sure you want to leave?', {
                onOk: () => {
                    this.props.sendGameMessage('leavegame');
                    this.props.closeGameSocket();
                }
            });

            return;
        }

        this.props.sendGameMessage('leavegame');
        this.props.closeGameSocket();
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    onMouseOut() {
        this.props.clearZoom();
    }

    onCardClick(card) {
        if(card && card.uuid) {
            this.props.sendGameMessage('cardClicked', card.uuid);
        }
    }

    onRingClick(ring) {
        this.props.sendGameMessage('ringClicked', ring);
    }

    onConflictClick() {
        this.props.sendGameMessage('showConflictDeck');

        this.setState({ showConflictDeck: !this.state.showConflictDeck });
    }

    onDynastyClick() {
        this.props.sendGameMessage('showDynastyDeck');

        this.setState({ showDynastyDeck: !this.state.showDynastyDeck });
    }

    onConflictTopCardClick() {
        this.props.sendGameMessage('conflictTopCardClicked');
    }

    sendMessage(message) {
        if(message === '') {
            return;
        }

        this.props.sendGameMessage('chat', message);
    }

    onConflictShuffleClick() {
        this.props.sendGameMessage('shuffleConflictDeck');
    }

    onDynastyShuffleClick() {
        this.props.sendGameMessage('shuffleDynastyDeck');
    }

    onDragDrop(card, source, target) {
        this.props.sendGameMessage('drop', card.uuid, source, target);
    }

    onCardDragStart(event, card, source) {
        let dragData = { card: card, source: source };
        event.dataTransfer.setData('Text', JSON.stringify(dragData));
    }

    getCardsInPlay(player, isMe) {
        if(!player) {
            return [];
        }

        let sortedCards = _.sortBy(player.cardPiles.cardsInPlay, card => {
            return card.type;
        });

        if(!isMe) {
            // we want locations on the bottom, other side wants locations on top
            sortedCards = sortedCards.reverse();
        }

        let cardsByType = _.groupBy(sortedCards, card => {
            return card.type;
        });

        let cardsByLocation = [];

        _.each(cardsByType, cards => {
            let cardsInPlay = _.map(cards, card => {
                return (<Card key={ card.uuid } source='play area' card={ card } disableMouseOver={ card.facedown && !card.code }
                    onMenuItemClick={ this.onMenuItemClick } onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut }
                    onClick={ this.onCardClick } onDragDrop={ this.onDragDrop } size={ this.props.user.settings.cardSize } />);
            });
            cardsByLocation.push(cardsInPlay);
        });

        return cardsByLocation;
    }

    onCommand(command, arg, uuid, method) {
        let commandArg = arg;

        this.props.sendGameMessage(command, commandArg, uuid, method);
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDragDropEvent(event, target) {
        event.stopPropagation();
        event.preventDefault();

        let card = event.dataTransfer.getData('Text');
        if(!card) {
            return;
        }

        let dragData = tryParseJSON(card);

        if(!dragData) {
            return;
        }

        this.onDragDrop(dragData.card, dragData.source, target);
    }

    onMenuItemClick(card, menuItem) {
        this.props.sendGameMessage('menuItemClick', card.uuid, menuItem);
    }

    onRingMenuItemClick(ring, menuItem) {
        this.props.sendGameMessage('ringMenuItemClick', ring, menuItem);
    }

    onPromptedActionWindowToggle(option, value) {
        this.props.sendGameMessage('togglePromptedActionWindow', option, value);
    }

    onTimerSettingToggle(option, value) {
        this.props.sendGameMessage('toggleTimerSetting', option, value);
    }

    onOptionSettingToggle(option, value) {
        this.props.sendGameMessage('toggleOptionSetting', option, value);
    }

    onTimerExpired() {
        this.props.sendGameMessage('menuButton', null, 'pass');
    }

    onSettingsClick(event) {
        event.preventDefault();

        $(findDOMNode(this.refs.modal)).modal('show');
    }

    onToggleChatClick(event) {
        event.preventDefault();
        this.setState({
            showChat: !this.state.showChat,
            showChatAlert: this.state.showChat && this.state.showChatAlert
        });
    }

    onManualModeClick(event) {
        event.preventDefault();
        this.props.sendGameMessage('toggleManualMode');
    }

    getRings() {
        return (<div className='panel ring-panel'>
            <Ring ring={ this.props.currentGame.rings.air } onClick={ this.onRingClick } size={ this.props.user.settings.cardSize } onMenuItemClick={ this.onRingMenuItemClick } />
            <Ring ring={ this.props.currentGame.rings.earth } onClick={ this.onRingClick } size={ this.props.user.settings.cardSize } onMenuItemClick={ this.onRingMenuItemClick } />
            <Ring ring={ this.props.currentGame.rings.fire } onClick={ this.onRingClick } size={ this.props.user.settings.cardSize } onMenuItemClick={ this.onRingMenuItemClick } />
            <Ring ring={ this.props.currentGame.rings.void } onClick={ this.onRingClick } size={ this.props.user.settings.cardSize } onMenuItemClick={ this.onRingMenuItemClick } />
            <Ring ring={ this.props.currentGame.rings.water } onClick={ this.onRingClick } size={ this.props.user.settings.cardSize } onMenuItemClick={ this.onRingMenuItemClick } />
        </div>);
    }

    renderSidebar(thisPlayer, otherPlayer) {
        return (
            <div className='province-pane'>
                {
                    thisPlayer.optionSettings.showStatusInSidebar &&
                    <div className='player-stats-box'>
                        <PlayerStatsBox
                            stats={ otherPlayer ? otherPlayer.stats : null }
                            user={ otherPlayer ? otherPlayer.user : null }
                            firstPlayer={ otherPlayer && otherPlayer.firstPlayer }
                            otherPlayer
                            handSize={ otherPlayer && otherPlayer.cardPiles.hand ? otherPlayer.cardPiles.hand.length : 0 }
                        />
                    </div>
                }
                { thisPlayer.hideProvinceDeck && <HonorFan value={ otherPlayer ? otherPlayer.showBid + '' : '0' } /> }
                { thisPlayer.hideProvinceDeck && this.getRings() }
                { thisPlayer.hideProvinceDeck && <HonorFan value={ thisPlayer.showBid + '' } /> }
                {
                    !thisPlayer.hideProvinceDeck &&
                    <div className='province-group our-side'>
                        <CardPile
                            className='province-deck'
                            title='Province Deck' source='province deck'
                            cards={ thisPlayer.cardPiles.provinceDeck }
                            hiddenTopCard
                            onMouseOver={ this.onMouseOver }
                            onMouseOut={ this.onMouseOut }
                            onCardClick={ this.onCardClick }
                            onDragDrop={ this.onDragDrop }
                            disablePopup={ this.state.spectating }
                            closeOnClick
                            size={ this.props.user.settings.cardSize } />
                    </div>
                }
                {
                    thisPlayer.optionSettings.showStatusInSidebar &&
                    <div className='player-stats-box our-side'>
                        <PlayerStatsBox
                            { ...bindActionCreators(actions, this.props.dispatch) }
                            stats={ thisPlayer.stats }
                            showControls={ !this.state.spectating }
                            user={ thisPlayer.user }
                            firstPlayer={ thisPlayer.firstPlayer }
                            otherPlayer={ false }
                            spectating={ this.state.spectating }
                            handSize={ thisPlayer.cardPiles.hand ? thisPlayer.cardPiles.hand.length : 0 } />
                    </div>
                }
            </div>
        );
    }

    getPrompt(thisPlayer) {
        return (<div className='inset-pane'>
            <ActivePlayerPrompt title={ thisPlayer.menuTitle }
                buttons={ thisPlayer.buttons }
                controls={ thisPlayer.controls }
                promptTitle={ thisPlayer.promptTitle }
                onButtonClick={ this.onCommand }
                onMouseOver={ this.onMouseOver }
                onMouseOut={ this.onMouseOut }
                user={ this.props.user }
                onTimerExpired={ this.onTimerExpired.bind(this) }
                phase={ thisPlayer.phase } />
        </div>);
    }

    getPlayerHand(thisPlayer) {
        let defaultPosition = {
            x: (window.innerWidth / 2) - 240,
            y: (window.innerHeight / 2)
        };

        if(!this.state.spectating) {
            return (<Draggable
                defaultPosition={ defaultPosition } >
                <div className='player-home-row-container'>
                    <PlayerHand
                        cards={ thisPlayer.cardPiles.hand }
                        isMe={ !this.state.spectating }
                        onCardClick={ this.onCardClick }
                        onDragDrop={ this.onDragDrop }
                        onMouseOut={ this.onMouseOut }
                        onMouseOver={ this.onMouseOver }
                        cardSize={ this.props.user.settings.cardSize } />
                </div>
            </Draggable>);
        }
    }

    render() {
        if(!this.props.currentGame) {
            return <div>Waiting for server...</div>;
        }

        let manualMode = this.props.currentGame.manualMode;

        let thisPlayer = this.props.currentGame.players[this.props.username];
        if(!thisPlayer) {
            thisPlayer = _.toArray(this.props.currentGame.players)[0];
        }

        if(!thisPlayer) {
            return <div>Waiting for game to have players or close...</div>;
        }

        let otherPlayer = _.find(this.props.currentGame.players, player => {
            return player.name !== thisPlayer.name;
        });

        let thisPlayerCards = [];
        let index = 0;
        let thisCardsInPlay = this.getCardsInPlay(thisPlayer, true);
        _.each(thisCardsInPlay, cards => {
            thisPlayerCards.push(<div className='card-row' key={ 'this-loc' + index++ }>{ cards }</div>);
        });

        let otherPlayerCards = [];
        if(otherPlayer) {
            _.each(this.getCardsInPlay(otherPlayer, false), cards => {
                otherPlayerCards.push(<div className='card-row' key={ 'other-loc' + index++ }>{ cards }</div>);
            });
        }

        for(let i = thisPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div className='card-row' key={ 'this-empty' + i } />);
        }

        for(let i = otherPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div className='card-row' key={ 'other-empty' + i } />);
        }

        let popup = (
            <div id='settings-modal' ref='modal' className='modal fade' tabIndex='-1' role='dialog'>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content settings-popup row'>
                        <div className='modal-header'>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button>
                            <h4 className='modal-title'>Game Configuration</h4>
                        </div>
                        <div className='modal-body col-xs-12'>
                            <GameConfiguration actionWindows={ thisPlayer.promptedActionWindows } timerSettings={ thisPlayer.timerSettings }
                                optionSettings={ thisPlayer.optionSettings } onOptionSettingToggle={ this.onOptionSettingToggle.bind(this) }
                                onToggle={ this.onPromptedActionWindowToggle.bind(this) } onTimerSettingToggle={ this.onTimerSettingToggle.bind(this) }
                            />
                        </div>
                    </div>
                </div>
            </div>);

        return (
            <div className='game-board'>
                { popup }
                { this.getPrompt(thisPlayer) }
                { this.getPlayerHand(thisPlayer) }
                {
                    !thisPlayer.optionSettings.showStatusInSidebar &&
                    <div className='player-stats-row'>
                        <PlayerStatsRow
                            stats={ otherPlayer ? otherPlayer.stats : null }
                            user={ otherPlayer ? otherPlayer.user : null }
                            firstPlayer={ otherPlayer && otherPlayer.firstPlayer }
                            otherPlayer
                            handSize={ otherPlayer && otherPlayer.cardPiles.hand ? otherPlayer.cardPiles.hand.length : 0 }
                        />
                    </div>
                }
                <div className='main-window'>
                    { this.renderSidebar(thisPlayer, otherPlayer) }
                    <div className='board-middle'>
                        <div className='player-deck-row'>
                            <DynastyRow
                                conflictDiscardPile={ otherPlayer ? otherPlayer.cardPiles.conflictDiscardPile : [] }
                                conflictDeck={ otherPlayer ? otherPlayer.cardPiles.conflictDeck : [] }
                                conflictDeckTopCardHidden={ otherPlayer ? otherPlayer.conflictDeckTopCardHidden : true }
                                dynastyDiscardPile={ otherPlayer ? otherPlayer.cardPiles.dynastyDiscardPile : [] }
                                dynastyDeck={ otherPlayer ? otherPlayer.cardPiles.dynastyDeck : [] }
                                numConflictCards={ otherPlayer ? otherPlayer.numConflictCards : 0 }
                                numDynastyCards={ otherPlayer ? otherPlayer.numDynastyCards : 0 }
                                province1Cards={ otherPlayer ? otherPlayer.provinces.one : [] }
                                province2Cards={ otherPlayer ? otherPlayer.provinces.two : [] }
                                province3Cards={ otherPlayer ? otherPlayer.provinces.three : [] }
                                province4Cards={ otherPlayer ? otherPlayer.provinces.four : [] }
                                onCardClick={ this.onCardClick }
                                onConflictTopCardClick={ this.onConflictTopCardClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                otherPlayer= { otherPlayer }
                                cardSize={ this.props.user.settings.cardSize } />
                        </div>
                        <div className='player-stronghold-row'>
                            <StrongholdRow
                                onCardClick={ this.onCardClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                otherPlayer= { otherPlayer }
                                strongholdProvinceCards={ otherPlayer ? otherPlayer.strongholdProvince : [] }
                                role={ otherPlayer ? otherPlayer.role : null }
                                cardSize={ this.props.user.settings.cardSize }
                            />
                        </div>
                        <div className='board-inner'>
                            <div className='play-area'>
                                <div className='player-board'>
                                    { otherPlayerCards }
                                </div>
                                <div className='player-board our-side' onDragOver={ this.onDragOver }
                                    onDrop={ event => this.onDragDropEvent(event, 'play area') } >
                                    { thisPlayerCards }
                                </div>
                            </div>
                        </div>
                        <div className='player-stronghold-row our-side'>
                            <StrongholdRow isMe={ !this.state.spectating }
                                spectating={ this.state.spectating }
                                onCardClick={ this.onCardClick }
                                onDragDrop={ this.onDragDrop }
                                onMenuItemClick={ this.onMenuItemClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                strongholdProvinceCards={ thisPlayer.strongholdProvince }
                                role={ thisPlayer.role }
                                thisPlayer ={ thisPlayer }
                                cardSize={ this.props.user.settings.cardSize } />
                        </div>
                        <div className='player-deck-row our-side'>
                            <DynastyRow isMe={ !this.state.spectating }
                                conflictDiscardPile={ thisPlayer.cardPiles.conflictDiscardPile }
                                conflictDeck={ thisPlayer.cardPiles.conflictDeck }
                                conflictDeckTopCardHidden={ thisPlayer.conflictDeckTopCardHidden }
                                dynastyDiscardPile={ thisPlayer.cardPiles.dynastyDiscardPile }
                                dynastyDeck={ thisPlayer.cardPiles.dynastyDeck }
                                onCardClick={ this.onCardClick }
                                onConflictClick={ this.onConflictClick }
                                onDynastyClick={ this.onDynastyClick }
                                onConflictTopCardClick={ this.onConflictTopCardClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                manualMode={ manualMode }
                                numConflictCards={ thisPlayer.numConflictCards }
                                numDynastyCards={ thisPlayer.numDynastyCards }
                                onConflictShuffleClick={ this.onConflictShuffleClick }
                                onDynastyShuffleClick={ this.onDynastyShuffleClick }
                                province1Cards={ thisPlayer.provinces.one }
                                province2Cards={ thisPlayer.provinces.two }
                                province3Cards={ thisPlayer.provinces.three }
                                province4Cards={ thisPlayer.provinces.four }
                                showConflictDeck={ this.state.showConflictDeck }
                                showDynastyDeck={ this.state.showDynastyDeck }
                                onDragDrop={ this.onDragDrop }
                                spectating={ this.state.spectating }
                                onMenuItemClick={ this.onMenuItemClick }
                                cardSize={ this.props.user.settings.cardSize } />
                        </div>
                    </div>
                    <div className='right-side'>
                        <CardZoom imageUrl={ this.props.cardToZoom ? '/img/cards/' + this.props.cardToZoom.id + '.jpg' : '' }
                            orientation={ this.props.cardToZoom ? this.props.cardToZoom.type === 'plot' ? 'horizontal' : 'vertical' : 'vertical' }
                            show={ !!this.props.cardToZoom } cardName={ this.props.cardToZoom ? this.props.cardToZoom.name : null } />
                        <Chat
                            visible={ this.state.showChat }
                            messages={ this.props.currentGame.messages }
                            onMouseOver={ this.onMouseOver }
                            onMouseOut={ this.onMouseOut }
                            sendMessage={ this.sendMessage }
                        />
                        <Controls
                            onSettingsClick={ this.onSettingsClick }
                            onManualModeClick={ this.onManualModeClick }
                            onToggleChatClick={ this.onToggleChatClick }
                            showChatAlert={ this.state.showChatAlert }
                            manualModeEnabled={ manualMode }
                            showManualMode={ !this.state.spectating }
                        />
                    </div>
                </div>
                {
                    !thisPlayer.optionSettings.showStatusInSidebar &&
                    <div className='player-stats-row our-side'>
                        <PlayerStatsRow
                            { ...bindActionCreators(actions, this.props.dispatch) }
                            stats={ thisPlayer.stats }
                            showControls={ !this.state.spectating }
                            user={ thisPlayer.user }
                            firstPlayer={ thisPlayer.firstPlayer }
                            otherPlayer={ false }
                            spectating={ this.state.spectating }
                            handSize={ thisPlayer.cardPiles.hand ? thisPlayer.cardPiles.hand.length : 0 } />
                    </div>
                }
            </div>);
    }
}

InnerGameBoard.displayName = 'GameBoard';
InnerGameBoard.propTypes = {
    cardToZoom: PropTypes.object,
    clearZoom: PropTypes.func,
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
    dispatch: PropTypes.func,
    sendGameMessage: PropTypes.func,
    setContextMenu: PropTypes.func,
    socket: PropTypes.object,
    user: PropTypes.object,
    username: PropTypes.string,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard,
        currentGame: state.games.currentGame,
        socket: state.socket.socket,
        user: state.auth.user,
        username: state.auth.username
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

const GameBoard = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(InnerGameBoard);

export default GameBoard;
