import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';

import PlayerStats from './GameComponents/PlayerStats.jsx';
import PlayerRow from './GameComponents/PlayerRow.jsx';
import MenuPane from './GameComponents/MenuPane.jsx';
import CardZoom from './GameComponents/CardZoom.jsx';
import Messages from './GameComponents/Messages.jsx';
import Card from './GameComponents/Card.jsx';

import * as actions from './actions';

export class InnerGameBoard extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.onPlotDeckClick = this.onPlotDeckClick.bind(this);
        this.onUsedPlotDeckClick = this.onUsedPlotDeckClick.bind(this);
        this.onOtherPlayerUsedPlotDeckClick = this.onOtherPlayerUsedPlotDeckClick.bind(this);
        this.onDrawClick = this.onDrawClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onCommand = this.onCommand.bind(this);
        this.onConcedeClick = this.onConcedeClick.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.cardMenuClick = this.cardMenuClick.bind(this);
        this.onShowUsedPlot = this.onShowUsedPlot.bind(this);
        this.onPlotCardClick = this.onPlotCardClick.bind(this);

        this.state = {
            canScroll: true,
            cardToZoom: undefined,
            showPlotDeck: false,
            showUsedPlotDeck: false,
            showOtherPlayerUsedPlotDeck: false,
            showDrawDeck: false,
            selectedPlot: undefined,
            spectating: true,
            message: '',
            showCardMenu: {}
        };
    }

    componentWillReceiveProps(props) {
        var thisPlayer = props.state.players[props.socket.id];

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

        var menuOptions = [
            { text: 'Leave Game', onClick: this.onLeaveClick }
        ];

        if(props.currentGame) {
            if(_.find(props.currentGame.players, p => {
                return p.id === props.socket.id;
            })) {
                menuOptions.unshift({ text: 'Concede', onClick: this.onConcedeClick });
            }

            menuOptions.unshift({ text: 'Spectators: ' + props.currentGame.spectators.length });

            this.setContextMenu(menuOptions);
        } else {
            this.setContextMenu([]);
        }
    }

    componentDidUpdate() {
        if(this.state.canScroll) {
            $(this.refs.messagePanel).scrollTop(999999);
        }
    }

    setContextMenu(menu) {
        if(this.props.setContextMenu) {
            this.props.setContextMenu(menu);
        }
    }

    onScroll() {
        var messages = this.refs.messagePanel;

        if(messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
            this.setState({ canScroll: true });
        } else {
            this.setState({ canScroll: false });
        }
    }

    onConcedeClick() {
        this.props.socket.emit('concede');
    }

    onLeaveClick() {
        this.props.socket.emit('leavegame');
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    onMouseOut() {
        this.props.clearZoom();
    }

    onCardClick(source, card) {
        this.props.sendSocketMessage('cardclick', source, card.uuid);
    }

    onDrawClick() {
        this.props.socket.emit('showdrawdeck');

        this.setState({ showDrawDeck: !this.state.showDrawDeck });
    }

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.socket.emit('chat', this.state.message);

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

    onShuffleClick() {
        this.props.socket.emit('shuffledeck');
    }

    onPlotCardClick(source, card) {
        var thisPlayer = this.props.state.players[this.props.socket.id];

        _.each(thisPlayer.plotDeck, plot => {
            plot.selected = false;
        });

        card.selected = true;
        this.setState({ selectedPlot: card });
    }

    onPlotDeckClick() {
        if(this.state.showUsedPlotDeck) {
            this.setState({ showUsedPlotDeck: !this.state.showUsedPlotDeck });
        }

        if(this.state.showOtherPlayerUsedPlotDeck) {
            this.setState({ showOtherPlayerUsedPlotDeck: !this.state.showOtherPlayerUsedPlotDeck });
        }

        this.setState({ showPlotDeck: !this.state.showPlotDeck });
    }

    onShowUsedPlot() {
        if(this.state.showPlotDeck) {
            this.setState({ showPlotDeck: !this.state.showPlotDeck });
        }

        if(this.state.showOtherPlayerUsedPlotDeck) {
            this.setState({ showOtherPlayerUsedPlotDeck: !this.state.showOtherPlayerUsedPlotDeck });
        }

        this.setState({ showUsedPlotDeck: !this.state.showUsedPlotDeck });
    }

    onUsedPlotDeckClick() {
        var thisPlayer = this.props.state.players[this.props.socket.id];

        if(thisPlayer && thisPlayer.activePlot && thisPlayer.activePlot.menu) {
            var cardMenus = this.state.showCardMenu;

            cardMenus[thisPlayer.activePlot.code] = !cardMenus[thisPlayer.activePlot.code];

            this.setState({ showCardMenu: cardMenus });
            
            return;
        }

        return this.onShowUsedPlot();
    }

    onOtherPlayerUsedPlotDeckClick() {
        if(this.state.showPlotDeck) {
            this.setState({ showPlotDeck: !this.state.showPlotDeck });
        }

        if(this.state.showUsedPlotDeck) {
            this.setState({ showUsedPlotDeck: !this.state.showUsedPlotDeck });
        }

        this.setState({ showOtherPlayerUsedPlotDeck: !this.state.showOtherPlayerUsedPlotDeck });
    }

    onDragDrop(card, source, target) {
        this.props.socket.emit('drop', card.uuid, source, target);
    }

    onCardDragStart(event, card, source) {
        var dragData = { card: card, source: source };
        event.dataTransfer.setData('Text', JSON.stringify(dragData));
    }

    getCardsInPlay(player, isMe) {
        var sortedCards = _.sortBy(player.cardsInPlay, card => {
            return card.type;
        });

        if(!isMe) {
            // we want locations on the bottom, other side wants locations on top
            sortedCards = sortedCards.reverse();
        }

        var cardsByType = _.groupBy(sortedCards, card => {
            return card.type;
        });

        var cardsByLocation = [];

        _.each(cardsByType, cards => {
            var cardsInPlay = _.map(cards, card => {
                return (<Card key={card.uuid} source='play area' card={card} disableMouseOver={card.facedown && !card.code}
                                    onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onCardClick} />);
            });
            cardsByLocation.push(cardsInPlay);
        });

        return cardsByLocation;
    }

    onCommand(command, arg, method) {
        var commandArg = arg;

        if(arg === 'plotselected') {
            if(!this.state.selectedPlot) {
                return;
            }

            commandArg = this.state.selectedPlot.uuid;
        }

        this.props.socket.emit(command, commandArg, method);
    }

    getPlotDeck(deck) {
        var plotDeck = _.map(deck, card => {
            var plotCard = <Card key={card.uuid} source='plot deck' card={card} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onPlotCardClick} />;

            return plotCard;
        });

        return plotDeck;
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDragDropEvent(event, target) {
        event.stopPropagation();
        event.preventDefault();

        var card = event.dataTransfer.getData('Text');
        if(!card) {
            return;
        }

        var dragData = JSON.parse(card);

        this.onDragDrop(dragData.card, dragData.source, target);
    }

    cardMenuClick(card, menuItem) {
        this.props.socket.emit(menuItem.command, menuItem.arg, menuItem.method);
    }

    render() {
        if(!this.props.state) {
            return <div>Waiting for server...</div>;
        }

        var thisPlayer = this.props.state.players[this.props.socket.id];
        if(!thisPlayer) {
            thisPlayer = _.toArray(this.props.state.players)[0];
        }

        var otherPlayer = _.find(this.props.state.players, player => {
            return player.id !== thisPlayer.id;
        });

        var plotDeck = this.getPlotDeck(thisPlayer.plotDeck);
        var thisPlayerUsedPlotDeck = this.getPlotDeck(thisPlayer.plotDiscard);
        if(otherPlayer) {
            var otherPlayerUsedPlotDeck = this.getPlotDeck(otherPlayer.plotDiscard);
        }

        var thisPlayerCards = [];

        var index = 0;

        var thisCardsInPlay = this.getCardsInPlay(thisPlayer, true);
        _.each(thisCardsInPlay, cards => {
            thisPlayerCards.push(<div className='card-row' key={'this-loc' + index++}>{cards}</div>);
        });
        var otherPlayerCards = [];

        if(otherPlayer) {
            _.each(this.getCardsInPlay(otherPlayer, false), cards => {
                otherPlayerCards.push(<div className='card-row' key={'other-loc' + index++}>{cards}</div>);
            });
        }

        for(var i = thisPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div className='card-row' key={'this-empty' + i} />);
        }

        for(i = otherPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div className='card-row' key={'other-empty' + i} />);
        }

        var menuIndex = 0;
        var plotMenuItems = thisPlayer.activePlot && this.state.showCardMenu[thisPlayer.activePlot.code] ? _.map(thisPlayer.activePlot.menu, menuItem => {
            return <div key={menuIndex++} onClick={this.cardMenuClick.bind(this, thisPlayer.activePlot, menuItem)}>{menuItem.text}</div>;
        }) : null;

        var plotMenu = plotMenuItems ? (
            <div className='panel menu'>
                <div onClick={this.onShowUsedPlot}>Show</div>
                {plotMenuItems}
            </div>
        ) : null;

        return (
            <div className='game-board'>
                <div className='main-window'>
                    <PlayerRow agenda={otherPlayer ? otherPlayer.agenda : undefined}
                        faction={otherPlayer ? otherPlayer.faction : undefined}
                        hand={otherPlayer ? otherPlayer.hand : []} isMe={false}
                        numDrawCards={otherPlayer ? otherPlayer.numDrawCards : 0}
                        power={otherPlayer ? otherPlayer.power : 0}
                        discardPile={otherPlayer ? otherPlayer.discardPile : []}
                        deadPile={otherPlayer ? otherPlayer.deadPile : []}
                        onMouseOver={this.onMouseOver}
                        onMouseOut={this.onMouseOut}
                        />
                    <div className='middle'>
                        <div className='left-side'>
                            <PlayerStats gold={otherPlayer ? otherPlayer.gold : 0} claim={otherPlayer ? otherPlayer.claim : 0}
                                reserve={otherPlayer ? otherPlayer.reserve : 0} power={otherPlayer ? otherPlayer.totalPower : 0} />
                            <div className='plots-pane'>
                                <div className='relative'>
                                    <div className='panel horizontal-card'>
                                        <div className='panel-header'>
                                            {'Plot (' + (otherPlayer ? otherPlayer.numPlotCards : 0) + ')'}
                                        </div>

                                        <img className='kneeled' src='/img/cards/cardback.jpg' />
                                    </div>
                                    <div className='panel horizontal-card' onClick={this.onOtherPlayerUsedPlotDeckClick}>
                                        <div className='panel-header'>
                                            {'Active Plot'}
                                        </div>
                                        {(otherPlayer && otherPlayer.activePlot) ?
                                            <img className='horizontal card' src={'/img/cards/' + otherPlayer.activePlot.code + '.png'}
                                                onMouseOver={otherPlayer ? this.onMouseOver.bind(this, otherPlayer.activePlot) : null}
                                                onMouseOut={this.onMouseOut} /> : null}

                                        {this.state.showOtherPlayerUsedPlotDeck ? <div className='panel plot-popup un-kneeled'>
                                            <div className='panel-header'>
                                                {'Used Plots (' + (otherPlayer ? otherPlayer.plotDiscard.length : 0) + ')'}
                                            </div>
                                            {otherPlayer ? otherPlayerUsedPlotDeck : null}
                                        </div> : null}
                                    </div>
                                    {otherPlayer && otherPlayer.plotSelected ?
                                        <div className='panel horizontal-card opponent selected-plot'>
                                            <img className='kneeled' src='/img/cards/cardback.jpg' />
                                        </div> : null
                                    }
                                </div>
                                <div className='relative'>
                                    {thisPlayer.plotSelected ?
                                        <div className='panel horizontal-card selected-plot'>
                                            <img className='kneeled card' src='/img/cards/cardback.jpg' />
                                        </div> : null
                                    }
                                    <div ref='thisPlayerUsedPlot' className='panel horizontal-card' onClick={this.onUsedPlotDeckClick}>
                                        <div className='panel-header'>
                                            {'Active Plot'}
                                        </div>
                                        {thisPlayer.activePlot ?
                                            <img className='horizontal card' src={'/img/cards/' + thisPlayer.activePlot.code + '.png'}
                                                onMouseOver={this.onMouseOver.bind(this, thisPlayer.activePlot)}
                                                onMouseOut={this.onMouseOut} /> : null}

                                        {this.state.showUsedPlotDeck ? <div className='panel plot-popup un-kneeled'>
                                            <div className='panel-header'>
                                                {'Used Plots (' + thisPlayer.plotDiscard.length + ')'}
                                            </div>
                                            {thisPlayerUsedPlotDeck}
                                        </div> : null}
                                        {plotMenu}
                                    </div>
                                    <div className='panel horizontal-card' onClick={this.state.spectating ? null : this.onPlotDeckClick}>
                                        <div className='panel-header'>
                                            {'Plot (' + (this.state.spectating ? thisPlayer.numPlotCards : plotDeck.length) + ')'}
                                        </div>
                                        <img className='kneeled card' src='/img/cards/cardback.jpg' />

                                        {this.state.showPlotDeck ? <div className='panel plot-popup un-kneeled'>
                                            {plotDeck}
                                        </div> : null}
                                    </div>
                                </div>
                            </div>

                            <PlayerStats gold={thisPlayer.gold || 0} claim={thisPlayer.claim || 0} reserve={thisPlayer.reserve || 0}
                                power={thisPlayer.totalPower} isMe={!this.state.spectating} />
                        </div>
                        <div className='inset-pane'>
                            <div />
                            <MenuPane title={thisPlayer.menuTitle} buttons={thisPlayer.buttons}
                                disabled={(thisPlayer.phase === 'plot' && !this.state.selectedPlot)}
                                onButtonClick={this.onCommand} />
                        </div>
                        <div className='play-area'>
                            <div className='player-board'>
                                {otherPlayerCards}
                            </div>
                            <div className='player-board our-side' onDragOver={this.onDragOver}
                                onDrop={(event) => this.onDragDropEvent(event, 'play area')} >
                                {thisPlayerCards}
                            </div>
                        </div>
                    </div>
                    <PlayerRow isMe={!this.state.spectating}
                        agenda={thisPlayer.agenda}
                        faction={thisPlayer.faction}
                        hand={thisPlayer.hand}
                        onCardClick={this.onCardClick}
                        onMouseOver={this.onMouseOver}
                        onMouseOut={this.onMouseOut}
                        numDrawCards={thisPlayer.numDrawCards}
                        onDrawClick={this.onDrawClick}
                        onShuffleClick={this.onShuffleClick}
                        showDrawDeck={this.state.showDrawDeck}
                        drawDeck={thisPlayer.drawDeck}
                        onDragDrop={this.onDragDrop}
                        power={thisPlayer.power}
                        discardPile={thisPlayer.discardPile}
                        deadPile={thisPlayer.deadPile}
                        spectating={this.state.spectating}
                        onCardMenuClick={this.cardMenuClick}/>
                </div>
                <div className='right-side'>
                    <CardZoom imageUrl={this.props.cardToZoom ? '/img/cards/' + this.props.cardToZoom.code + '.png' : ''}
                        orientation={this.props.cardToZoom ? this.props.cardToZoom.type === 'plot' ? 'horizontal' : 'vertical' : 'vertical'}
                        show={!!this.props.cardToZoom} cardName={this.props.cardToZoom ? this.props.cardToZoom.name : null} />
                    <div className='chat'>
                        <div className='messages panel' ref='messagePanel' onScroll={this.onScroll}>
                            <Messages messages={this.props.state.messages} onCardMouseOver={this.onMouseOver} onCardMouseOut={this.onMouseOut} />
                        </div>
                        <form>
                            <input className='form-control' placeholder='Chat...' onKeyPress={this.onKeyPress} onChange={this.onChange}
                                value={this.state.message} />
                        </form>
                    </div>
                </div>
            </div>);
    }
}

InnerGameBoard.displayName = 'GameBoard';
InnerGameBoard.propTypes = {
    cardToZoom: React.PropTypes.object,
    clearZoom: React.PropTypes.func,
    currentGame: React.PropTypes.object,
    sendSocketMessage: React.PropTypes.func,
    setContextMenu: React.PropTypes.func,
    socket: React.PropTypes.object,
    state: React.PropTypes.object,
    zoomCard: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard,
        currentGame: state.games.currentGame,
        socket: state.socket.socket,
        state: state.games.state
    };
}

const GameBoard = connect(mapStateToProps, actions, null, { withRef: true })(InnerGameBoard);

export default GameBoard;
