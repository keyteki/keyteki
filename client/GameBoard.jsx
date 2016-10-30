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

        this.state = {
            cardToZoom: undefined,
            showPlotDeck: false,
            showDrawDeck: false,
            selectedPlot: undefined
        };
    }

    componentWillReceiveProps(props) {
        var thisPlayer = props.state.players[props.socket.id];

        if(thisPlayer.selectCard) {
            $('body').addClass('select-cursor');
        } else {
            $('body').removeClass('select-cursor');
        }
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
        if(!this.canPlayCard(card)) {
            return;
        }

        this.props.socket.emit('playcard', card);
    }

    onCardClick2(card) {
        this.props.socket.emit('cardclick', card);
    }

    onDrawClick() {
        if(!this.state.showDrawDeck) {
            this.props.socket.emit('showdrawdeck');
        }

        this.setState({ showDrawDeck: !this.state.showDrawDeck });
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

    getCardsInPlay(player) {
        var index = 0;

        return _.map(player.cardsInPlay, card => {
            var attachments = _.map(card.attachments, a => {
                return (
                    <div className='attachment'>
                        <div className='card' onMouseOver={this.onMouseOver.bind(this, a)} onMouseOut={this.onMouseOut}
                            onClick={this.onCardClick2.bind(this, a)}>
                            <div>
                                {card.facedown ?
                                    <img className='card' src='/img/cards/cardback.jpg' /> :
                                    <img className='card' src={'/img/cards/' + a.code + '.png'} />}
                            </div>
                        </div>
                    </div>);
            });

            var counters = null;
            var dupes = null;
            var power = null;

            if(card.dupes.length !== 0) {
                dupes = (<div className='counter dupe'>
                    {card.dupes.length + 1}
                </div>);
            }

            if(card.power > 0) {
                power = (<div className='counter power'>
                    {card.power}
                </div>);
            }

            if(dupes || power) {
                counters = (
                    <div className='counters'>
                        {dupes}
                        {power}
                    </div>
                );
            }

            var cardClass = 'card';
            if(card.selected) {
                cardClass += ' selected';
            }

            if(card.kneeled) {
                cardClass += ' vertical kneeled';
            }

            var cardInPlay = (
                <div className='card-wrapper' key={'card' + index.toString()}>
                    <div className='card-frame'>
                        <div className={card.kneeled ? 'horizontal-card kneeled' : 'card'} onMouseOver={this.onMouseOver.bind(this, card.card)} onMouseOut={this.onMouseOut}
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
    }

    onCommand(command, arg) {
        var commandArg = arg;

        if(command === 'selectplot') {
            if(!this.state.selectedPlot) {
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

            if(card === this.state.selectedPlot) {
                plotClass += ' selected';
            }

            var plotCard = (
                <div className='card-wrapper'>
                    <div className='card-frame'>
                        <div key={'card' + index.toString()} className={plotClass} onMouseOver={this.onMouseOver ? this.onMouseOver.bind(this, card) : null}
                            onMouseOut={this.onMouseOut} onClick={(event) => this.onPlotCardClick(event, card)}>
                            <img className='plot-card' src={'/img/cards/' + card.code + '.png'} />
                        </div>
                    </div>
                </div>);

            index++;

            return plotCard;
        });

        return plotDeck;
    }

    render() {
        if(!this.props.state) {
            return <div>Waiting for server...</div>;
        }

        var thisPlayer = this.props.state.players[this.props.socket.id];
        var otherPlayer = _.find(this.props.state.players, player => {
            return player.id !== this.props.socket.id;
        });

        var plotDeck = this.getPlotDeck(thisPlayer.plotDeck);

        return (
            <div className='game-board'>
                <div className='main-window'>
                    <PlayerRow agenda={otherPlayer ? otherPlayer.agenda : undefined}
                        faction={otherPlayer ? otherPlayer.faction : undefined}
                        hand={otherPlayer ? otherPlayer.hand : []} isMe={false}
                        numDrawCards={otherPlayer ? otherPlayer.numDrawCards : 0}
                        power={otherPlayer ? otherPlayer.power : 0} />
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
                                    <div className='panel horizontal-card' onClick={this.onPlotDeckClick}>
                                        <div className='panel-header'>
                                            {'Plot (' + plotDeck.length + ')'}
                                        </div>
                                        <img className='vertical card' src='/img/cards/cardback.jpg' />

                                        {this.state.showPlotDeck ? <div className='panel plot-popup un-kneeled'>
                                            {plotDeck}
                                        </div> : null}
                                    </div>
                                </div>
                            </div>

                            <PlayerStats gold={thisPlayer.gold || 0} claim={thisPlayer.claim || 0} reserve={thisPlayer.reserve || 0}
                                power={thisPlayer.totalPower} isMe />
                        </div>
                        <div className='inset-pane'>
                            <div />
                            <MenuPane title={thisPlayer.menuTitle} buttons={thisPlayer.buttons}
                                disabled={(thisPlayer.phase === 'plot' && !this.state.selectedPlot)}
                                onButtonClick={this.onCommand} />
                        </div>
                        <div className='play-area'>
                            <div className='player-board'>
                                <div>
                                    {otherPlayer ? this.getCardsInPlay(otherPlayer) : null}
                                </div>
                                <div />
                            </div>
                            <div className='player-board our-side'>
                                <div>
                                    {this.getCardsInPlay(thisPlayer)}
                                </div>
                                <div />
                            </div>
                        </div>
                    </div>
                    <PlayerRow isMe
                        agenda={thisPlayer.agenda}
                        faction={thisPlayer.faction}
                        hand={thisPlayer.hand}
                        onCardClick={this.onCardClick}
                        onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}
                        numDrawCards={thisPlayer.numDrawCards}
                        onDrawClick={this.onDrawClick}
                        showDrawDeck={this.state.showDrawDeck}
                        drawDeck={thisPlayer.drawDeck}
                        onDragDrop={this.onDragDrop}
                        power={thisPlayer.power}
                        discardPile={thisPlayer.discardPile} />
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
    socket: React.PropTypes.object,
    state: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket,
        state: state.games.state
    };
}

const GameBoard = connect(mapStateToProps, actions)(InnerGameBoard);

export default GameBoard;

