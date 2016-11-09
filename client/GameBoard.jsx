import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';

import PlayerStats from './GameComponents/PlayerStats.jsx';
import PlayerRow from './GameComponents/PlayerRow.jsx';
import MenuPane from './GameComponents/MenuPane.jsx';
import CardZoom from './GameComponents/CardZoom.jsx';
import Messages from './GameComponents/Messages.jsx';
import * as actions from './actions';

class InnerGameBoard extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.onCardClick2 = this.onCardClick2.bind(this);
        this.onPlotDeckClick = this.onPlotDeckClick.bind(this);
        this.onDrawClick = this.onDrawClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onCommand = this.onCommand.bind(this);
        this.onConcedeClick = this.onConcedeClick.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);

        this.state = {
            cardToZoom: undefined,
            showPlotDeck: false,
            showDrawDeck: false,
            selectedPlot: undefined,
            spectating: true
        };
    }

    componentWillReceiveProps(props) {
        var thisPlayer = props.state.players[props.socket.id];

        if (thisPlayer) {
            this.setState({ spectating: false });
        } else {
            this.setState({ spectating: true });
        }

        if (thisPlayer && thisPlayer.selectCard) {
            $('body').addClass('select-cursor');
        } else {
            $('body').removeClass('select-cursor');
        }

        if (props.currentGame) {
            this.props.setContextMenu([
                { text: 'Concede', onClick: this.onConcedeClick },
                { text: 'Leave Game', onClick: this.onLeaveClick }
            ]);
        } else {
            this.props.setContextMenu([]);
        }
    }

    onConcedeClick() {
        this.props.socket.emit('concede');
    }

    onLeaveClick() {
        this.props.socket.emit('leavegame');
    }

    onMouseOver(card) {
        this.setState({ cardToZoom: card });
    }

    onMouseOut() {
        this.setState({ cardToZoom: undefined });
    }

    canPlayCard(card) {
        var thisPlayer = this.props.state.players[this.props.socket.id];

        // if(card.cost > thisPlayer.gold) {
        //     return false;
        // }

        return true;
    }

    onCardClick(card) {
        if (!this.canPlayCard(card)) {
            return;
        }

        this.props.socket.emit('playcard', card);
    }

    onCardClick2(card) {
        this.props.socket.emit('cardclick', card);
    }

    onDrawClick() {
        this.props.socket.emit('showdrawdeck');

        this.setState({ showDrawDeck: !this.state.showDrawDeck });
    }

    onShuffleClick() {
        this.props.socket.emit('shuffledeck');
    }

    onPlotCardClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ selectedPlot: card });
    }

    onPlotDeckClick() {
        this.setState({ showPlotDeck: !this.state.showPlotDeck });
    }

    onDragDrop(card, source, target) {
        this.props.socket.emit('drop', card, source, target);
    }

    onCardDragStart(event, card, source) {
        var dragData = { card: card, source: source };
        event.dataTransfer.setData('card', JSON.stringify(dragData));
    }

    getCardsInPlay(player, isMe) {
        var index = 0;

        var cardsByType = _.groupBy(player.cardsInPlay, c => {
            return c.card.type_code;
        });

        var cardsByLocation = [];

        _.each(cardsByType, cards => {
            var cardsInPlay = _.map(cards, card => {
                var allowMouseOver = isMe || !card.facedown;
                var offset = 10;
                var attachments = _.map(card.attachments, a => {
                    var style = { top: offset + 'px', zIndex: -offset };
                    var returnedAttachment = (
                        <div className='attachment' style={style}>
                            <div className='card' onMouseOver={allowMouseOver ? this.onMouseOver.bind(this, a) : null}
                                onMouseOut={this.onMouseOut}
                                onClick={this.onCardClick2.bind(this, a)}>
                                <div>
                                    {card.facedown ?
                                        <img className='card' src='/img/cards/cardback.jpg' /> :
                                        <img className='card' src={'/img/cards/' + a.code + '.png'} />}
                                </div>
                            </div>
                        </div>);

                    offset += 10;

                    return returnedAttachment;
                });

                var counters = null;
                var dupes = null;
                var power = null;

                if (card.dupes.length !== 0) {
                    dupes = (<div className='counter dupe'>
                        {card.dupes.length + 1}
                    </div>);
                }

                if (card.power > 0) {
                    power = (<div className='counter power'>
                        {card.power}
                    </div>);
                }

                if (dupes || power) {
                    counters = (
                        <div className='counters'>
                            {dupes}
                            {power}
                        </div>
                    );
                }

                var cardClass = 'card';
                if (card.selected) {
                    cardClass += ' selected';
                }

                if (card.kneeled) {
                    cardClass += ' vertical kneeled';
                }

                var cardInPlay = (
                    <div className='card-wrapper' key={'card' + index.toString()}>
                        <div className='card-frame'>
                            <div className={card.kneeled ? 'horizontal-card kneeled' : 'card'}
                                onMouseOver={allowMouseOver ? this.onMouseOver.bind(this, card.card) : null}
                                onMouseOut={this.onMouseOut}
                                onDragStart={(ev) => this.onCardDragStart(ev, card.card, 'play area')}
                                onClick={this.onCardClick2.bind(this, card.card)}>
                                <div>
                                    {card.facedown ?
                                        <img className='card' src='/img/cards/cardback.jpg' /> :
                                        <img className={cardClass} src={'/img/cards/' + card.card.code + '.png'} />}
                                </div>
                                {counters}
                            </div>
                            {attachments}
                        </div>
                    </div>);

                index++;

                return cardInPlay;
            });
            cardsByLocation.push(cardsInPlay);
        });

        return cardsByLocation;
    }

    onCommand(command, arg) {
        var commandArg = arg;

        if (command === 'selectplot') {
            if (!this.state.selectedPlot) {
                return;
            }

            commandArg = this.state.selectedPlot;
        }

        this.props.socket.emit(command, commandArg);
    }

    getPlotDeck(deck) {
        var index = 0;

        var plotDeck = _.map(deck, card => {
            var plotClass = 'plot-card';

            if (card === this.state.selectedPlot) {
                plotClass += ' selected';
            }

            var plotCard = (
                <div key={'card' + index.toString()} className='card-wrapper'>
                    <div className='card-frame'>
                        <div className={plotClass} onMouseOver={this.onMouseOver ? this.onMouseOver.bind(this, card) : null}
                            onMouseOut={this.onMouseOut} onClick={event => this.onPlotCardClick(event, card)}>
                            <img className='plot-card' src={'/img/cards/' + card.code + '.png'} />
                        </div>
                    </div>
                </div>);

            index++;

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

        var dragData = JSON.parse(event.dataTransfer.getData('card'));

        this.onDragDrop(dragData.card, dragData.source, target);
    }

    render() {
        if (!this.props.state) {
            return <div>Waiting for server...</div>;
        }

        var thisPlayer = this.props.state.players[this.props.socket.id];
        if (!thisPlayer) {
            thisPlayer = _.toArray(this.props.state.players)[0];
        }
        var otherPlayer = _.find(this.props.state.players, player => {
            return player.id !== thisPlayer.id;
        });

        var plotDeck = this.getPlotDeck(thisPlayer.plotDeck);

        var thisPlayerCards = [];

        var index = 0;
        _.each(this.getCardsInPlay(thisPlayer, true).reverse(), cards => {
            thisPlayerCards.push(<div key={'this-loc' + index++}>{cards}</div>);
        });
        var otherPlayerCards = [];

        if (otherPlayer) {
            _.each(this.getCardsInPlay(otherPlayer, false).reverse(), cards => {
                otherPlayerCards.push(<div key={'other-loc' + index++}>{cards}</div>);
            });
        }

        for (var i = thisPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div key={'this-empty' + i} />);
        }

        for (i = otherPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div key={'other-empty' + i} />);
        }

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

                                        <img className='vertical' src='/img/cards/cardback.jpg' />
                                    </div>
                                    <div className='panel horizontal-card'
                                        onMouseOver={otherPlayer ? this.onMouseOver.bind(this, _.last(otherPlayer.plotDiscard)) : null}
                                        onMouseOut={this.onMouseOut}>
                                        <div className='panel-header'>
                                            {'Plot Discard (' + (otherPlayer ? otherPlayer.plotDiscard.length : 0) + ')'}
                                        </div>

                                        {otherPlayer && otherPlayer.plotDiscard.length > 0 ?
                                            <img className='horizontal' src={'/img/cards/' + _.last(otherPlayer.plotDiscard).code + '.png'} /> : null}
                                    </div>
                                    {otherPlayer && otherPlayer.plotSelected ?
                                        <div className='panel horizontal-card opponent selected-plot'>
                                            <img className='vertical' src='/img/cards/cardback.jpg' />
                                        </div> : null
                                    }
                                </div>
                                <div className='relative'>
                                    {thisPlayer.plotSelected ?
                                        <div className='panel horizontal-card selected-plot'>
                                            <img className='vertical' src='/img/cards/cardback.jpg' />
                                        </div> : null
                                    }
                                    <div className='panel horizontal-card' onMouseOver={this.onMouseOver.bind(this, _.last(thisPlayer.plotDiscard))}
                                        onMouseOut={this.onMouseOut}>
                                        <div className='panel-header'>
                                            {'Plot Discard (' + thisPlayer.plotDiscard.length + ')'}
                                        </div>

                                        {thisPlayer.plotDiscard.length > 0 ?
                                            <img className='horizontal card' src={'/img/cards/' + _.last(thisPlayer.plotDiscard).code + '.png'} /> : null}
                                    </div>
                                    <div className='panel horizontal-card' onClick={this.state.spectating ? null : this.onPlotDeckClick}>
                                        <div className='panel-header'>
                                            {'Plot (' + (this.state.spectating ? thisPlayer.numPlotCards : plotDeck.length) + ')'}
                                        </div>
                                        <img className='vertical card' src='/img/cards/cardback.jpg' />

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
                        spectating={this.state.spectating} />
                </div>
                <div className='right-side'>
                    <CardZoom imageUrl={this.state.cardToZoom ? '/img/cards/' + this.state.cardToZoom.code + '.png' : ''}
                        orientation={this.state.cardToZoom ? this.state.cardToZoom.type_code === 'plot' ? 'horizontal' : 'vertical' : 'vertical'}
                        show={!!this.state.cardToZoom} />
                    <Messages messages={this.props.state.messages} />
                </div>
            </div>);
    }
}

InnerGameBoard.displayName = 'GameBoard';
InnerGameBoard.propTypes = {
    currentGame: React.PropTypes.object,
    setContextMenu: React.PropTypes.func,
    socket: React.PropTypes.object,
    state: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.games.currentGame,
        socket: state.socket.socket,
        state: state.games.state
    };
}

const GameBoard = connect(mapStateToProps, actions)(InnerGameBoard);

export default GameBoard;

