import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import _ from 'underscore';
import $ from 'jquery';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';
import Draggable from 'react-draggable';

import PlayerStats from './GameComponents/PlayerStats.jsx';
import PlayerHand from './GameComponents/PlayerHand.jsx';
import DynastyRow from './GameComponents/DynastyRow.jsx';
import StrongholdRow from './GameComponents/StrongholdRow.jsx';
import Ring from './GameComponents/Ring.jsx';
import HonorFan from './GameComponents/HonorFan.jsx';
import ActivePlayerPrompt from './GameComponents/ActivePlayerPrompt.jsx';
import CardZoom from './GameComponents/CardZoom.jsx';
import Messages from './GameComponents/Messages.jsx';
import Card from './GameComponents/Card.jsx';
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
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onCommand = this.onCommand.bind(this);
        this.onConcedeClick = this.onConcedeClick.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.onConflictShuffleClick = this.onConflictShuffleClick.bind(this);
        this.onDynastyShuffleClick = this.onDynastyShuffleClick.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);

        this.state = {
            canScroll: true,
            cardToZoom: undefined,
            showConflictDeck: false,
            showDynastyDeck: false,
            spectating: true,
            message: '',
            showActionWindowsMenu: false,
            showCardMenu: {}
        };
    }

    componentDidMount() {
        this.updateContextMenu(this.props);
    }

    componentWillReceiveProps(props) {
        this.updateContextMenu(props);
    }

    componentDidUpdate() {
        if(this.state.canScroll) {
            $(this.refs.messagePanel).scrollTop(999999);
        }
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

    onScroll() {
        var messages = this.refs.messagePanel;

        setTimeout(() => {
            if(messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                this.setState({ canScroll: true });
            } else {
                this.setState({ canScroll: false });
            }
        }, 500);
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
        this.props.sendGameMessage('cardClicked', card.uuid);
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

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.sendGameMessage('chat', this.state.message);

        this.setState({ message: '' });
    }

    onChange(event) {
        this.setState({ message: event.target.value });
    }

    onKeyPress(event) {
        if(event.key === 'Enter') {
            this.sendMessage();

            event.preventDefault();
        }
    }

    onSendClick(event) {
        event.preventDefault();

        this.sendMessage();
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
    onCommand(command, arg, method) {
        let commandArg = arg;

        this.props.sendGameMessage(command, commandArg, method);
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

    onPromptedActionWindowToggle(option, value) {
        this.props.sendGameMessage('togglePromptedActionWindow', option, value);
    }

    onTimerSettingToggle(option, value) {
        this.props.sendGameMessage('toggleTimerSetting', option, value);
    }

    onKeywordSettingToggle(option, value) {
        this.props.sendGameMessage('toggleKeywordSetting', option, value);
    }

    onTimerExpired() {
        this.props.sendGameMessage('menuButton', null, 'pass');
    }

    onSettingsClick() {
        $(findDOMNode(this.refs.modal)).modal('show');
    }

    getRings() {
        return (<div className='panel ring-panel'>
        </div>);
    }

    getProvinces(thisPlayer, otherPlayer) {
        return (<div className='province-pane'>
            <HonorFan value={ otherPlayer ? otherPlayer.showBid : '0' } />
            <div className='province-group'>
                <CardPile className={ otherPlayer && otherPlayer.provinceSelected ? 'province-deck province-selected' : 'province-deck' }
                    title='Province Deck' source='province deck' 
                    cards={ otherPlayer ? otherPlayer.cardPiles.provinceDeck : [] }
                    hiddenTopCard
                    onMouseOver={ this.onMouseOver } 
                    onMouseOut={ this.onMouseOut } 
                    disableMouseOver disablePopup
                    onCardClick={ this.onCardClick } />
            </div>
            { this.getRings() }
            <div className='province-group our-side'>
                <CardPile className={ thisPlayer.provinceSelected ? 'province-deck province-selected' : 'province-deck' }
                    title='Province Deck' source='province deck' 
                    cards={ thisPlayer.cardPiles.provinceDeck } 
                    hiddenTopCard
                    onMouseOver={ this.onMouseOver } 
                    onMouseOut={ this.onMouseOut } 
                    onCardClick={ this.onCardClick } 
                    onDragDrop={ this.onDragDrop } 
                    closeOnClick />
            </div>
            <HonorFan value={ thisPlayer.showBid } />
        </div>);
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
        return (<Draggable
            defaultPosition={ { x: 800, y: 700 } } >
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

    render() {
        if(!this.props.currentGame) {
            return <div>Waiting for server...</div>;
        }

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

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

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
                                keywordSettings={ thisPlayer.keywordSettings } onKeywordSettingToggle={ this.onKeywordSettingToggle.bind(this) }
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
                <div className='player-stats-row'>
                    <PlayerStats stats={ otherPlayer ? otherPlayer.stats : null }
                        user={ otherPlayer ? otherPlayer.user : null } firstPlayer={ otherPlayer && otherPlayer.firstPlayer } otherPlayer={ true } handSize={ otherPlayer && otherPlayer.cardPiles.hand ? otherPlayer.cardPiles.hand.length : 0 }/>
                </div>
                <div className='main-window'>
                    { this.getProvinces(thisPlayer, otherPlayer) }
                    <div className='board-middle'>
                        <div className='player-deck-row'>
                            <DynastyRow
                                conflictDiscardPile={ otherPlayer ? otherPlayer.cardPiles.conflictDiscardPile : [] }
                                conflictDeck={ otherPlayer ? otherPlayer.cardPiles.conflictDeck : [] }
                                dynastyDiscardPile={ otherPlayer ? otherPlayer.cardPiles.dynastyDiscardPile : [] }
                                dynastyDeck={ otherPlayer ? otherPlayer.cardPiles.dynastyDeck : [] }
                                numConflictCards={ otherPlayer ? otherPlayer.numConflictCards : 0 }
                                numDynastyCards={ otherPlayer ? otherPlayer.numDynastyCards : 0 }
                                province1Cards={ otherPlayer ? otherPlayer.provinces.one : [] }
                                province2Cards={ otherPlayer ? otherPlayer.provinces.two : [] }
                                province3Cards={ otherPlayer ? otherPlayer.provinces.three : [] }
                                province4Cards={ otherPlayer ? otherPlayer.provinces.four : [] }
                                onCardClick={ this.onCardClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut } />
                        </div>
                        <div className='player-stronghold-row'>
                            <StrongholdRow
                                onCardClick={ this.onCardClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                otherPlayer= { otherPlayer }
                                strongholdProvinceCards={ otherPlayer ? otherPlayer.strongholdProvince : [] }
                                role={ otherPlayer ? otherPlayer.role : null }
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
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                strongholdProvinceCards={ thisPlayer.strongholdProvince }
                                role={ thisPlayer.role }
                                thisPlayer ={ thisPlayer } />
                        </div>
                        <div className='player-deck-row our-side'>
                            <DynastyRow isMe={ !this.state.spectating }
                                conflictDiscardPile={ thisPlayer.cardPiles.conflictDiscardPile }
                                conflictDeck={ thisPlayer.cardPiles.conflictDeck }
                                dynastyDiscardPile={ thisPlayer.cardPiles.dynastyDiscardPile }
                                dynastyDeck={ thisPlayer.cardPiles.dynastyDeck }
                                onCardClick={ this.onCardClick }
                                onConflictClick={ this.onConflictClick }
                                onDynastyClick={ this.onDynastyClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
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
                                onMenuItemClick={ this.onMenuItemClick } />
                        </div>
                    </div>
                    <div className='right-side'>
                        <CardZoom imageUrl={ this.props.cardToZoom ? '/img/cards/' + this.props.cardToZoom.id + '.jpg' : '' }
                            orientation={ this.props.cardToZoom ? this.props.cardToZoom.type === 'plot' ? 'horizontal' : 'vertical' : 'vertical' }
                            show={ !!this.props.cardToZoom } cardName={ this.props.cardToZoom ? this.props.cardToZoom.name : null } />
                        <div className='chat'>
                            <div className='messages panel' ref='messagePanel' onScroll={ this.onScroll }>
                                <Messages messages={ this.props.currentGame.messages } onCardMouseOver={ this.onMouseOver } onCardMouseOut={ this.onMouseOut } />
                            </div>
                            <form>
                                <input className='form-control' placeholder='Chat...' onKeyPress={ this.onKeyPress } onChange={ this.onChange }
                                    value={ this.state.message } />
                            </form>
                        </div>
                    </div>
                </div>
                <div className='player-stats-row our-side'>
                    <PlayerStats { ...boundActionCreators } stats={ thisPlayer.stats } showControls={ !this.state.spectating } user={ thisPlayer.user }
                        firstPlayer={ thisPlayer.firstPlayer } otherPlayer={ false } onSettingsClick={ this.onSettingsClick.bind(this) } />
                </div>
            </div>);
    }
}

InnerGameBoard.displayName = 'GameBoard';
InnerGameBoard.propTypes = {
    cardToZoom: PropTypes.object,
    clearZoom: PropTypes.func,
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
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
