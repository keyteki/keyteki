import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import PlayerStats from './GameComponents/PlayerStats.jsx';
import PlayerRow from './GameComponents/PlayerRow.jsx';
import * as actions from './actions';

class InnerGameBoard extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onCardClick = this.onCardClick.bind(this);

        this.onPlotDeckClick = this.onPlotDeckClick.bind(this);

        this.state = {
            cardToZoom: undefined,
            showPlotDeck: false,
            selectedPlot: undefined
        };
    }

    onMouseOver(card) {
        this.setState({ cardToZoom: card });
    }

    onMouseOut() {
        this.setState({ cardToZoom: undefined });
    }

    onButtonClick(event, command) {
        event.preventDefault();
        var arg = undefined;

        if(command === 'selectplot') {
            if(!this.state.selectedPlot) {
                return;
            }

            arg = this.state.selectedPlot;
        }

        this.props.socket.emit(command, arg);
    }

    canPlayCard(card) {
        var thisPlayer = this.props.state.players[this.props.socket.id];

        if(card.cost > thisPlayer.gold) {
            return false;
        }

        return true;
    }

    onCardClick(card) {
        if(!this.canPlayCard(card)) {
            return;
        }

        this.props.socket.emit('playcard', card);
    }

    onPlotCardClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ selectedPlot: card });
    }

    onPlotDeckClick() {
        this.setState({ showPlotDeck: !this.state.showPlotDeck });
    }

    isButtonDisabled(button) {
        if(button.command === 'selectplot') {
            return !this.state.selectedPlot;
        }

        return false;
    }

    render() {
        if(!this.props.state) {
            return <div>Waiting for server...</div>;
        }

        var thisPlayer = this.props.state.players[this.props.socket.id];
        var otherPlayer = _.find(this.props.state.players, player => {
            return player.id !== this.props.socket.id;
        });

        var index = 0;
        var thisPlayerCardsInPlay = _.map(thisPlayer.cardsInPlay, card => {
            var cardInPlay = (
                <div className='card-wrapper' key={'card' + index.toString()}>
                    <div className='card-frame'>
                        <div className='card' onMouseOver={this.onMouseOver.bind(this, card.card)} onMouseOut={this.onMouseOut}>
                            <div>
                                {card.facedown ?
                                    <img className='card' src='/img/cards/cardback.jpg' /> :
                                    <img className='card' src={'/img/cards/' + card.card.code + '.png'} />}
                            </div>
                        </div>
                    </div>
                </div>);

            index++;

            return cardInPlay;
        });

        index = 0;
        var otherPlayerCardsInPlay = otherPlayer ? _.map(otherPlayer.cardsInPlay, card => {
            var cardInPlay = (<div key={'card' + index.toString()} className='card' onMouseOver={card.facedown ? null : this.onMouseOver.bind(this, card.card)}
                onMouseOut={card.facedown ? null : this.onMouseOut}>
                {card.facedown ? <img src='/img/cards/cardback.jpg' /> : <img src={'/img/cards/' + card.card.code + '.png'} />}
            </div>);

            index++;

            return cardInPlay;
        }) : null;

        index = 0;
        var plotDeck = _.map(thisPlayer.plotDeck, card => {
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

        var buttons = _.map(thisPlayer.buttons, button => {
            return (<button key={button.command} className='btn btn-primary' onClick={(event) => this.onButtonClick(event, button.command)}
                disabled={this.isButtonDisabled(button)}>{button.text}</button>);
        });

        return (
            <div className='game-board'>
                <div className='main-window'>
                    <PlayerRow agenda={otherPlayer ? otherPlayer.agenda : undefined} faction={otherPlayer ? otherPlayer.faction : undefined} hand={otherPlayer ? otherPlayer.hand : []} isMe={false} />
                    <div className='middle'>
                        <div className='left-side'>
                            <PlayerStats gold={otherPlayer ? otherPlayer.gold : 0} claim={otherPlayer ? otherPlayer.claim : 0}
                                reserve={otherPlayer ? otherPlayer.reserve : 0} power={otherPlayer ? otherPlayer.totalPower : 0} />
                            <div className='plots-pane'>
                                <div className='relative'>
                                    <div className='panel horizontal-card'>
                                        <img className='vertical' src='/img/cards/cardback.jpg' />
                                    </div>
                                    <div className='panel horizontal-card'
                                        onMouseOver={otherPlayer ? this.onMouseOver.bind(this, otherPlayer.plotDiscard[0]) : null}
                                        onMouseOut={this.onMouseOut}>
                                        {otherPlayer && otherPlayer.plotDiscard.length > 0 ?
                                            <img className='horizontal' src={'/img/cards/' + otherPlayer.plotDiscard[0].code + '.png'} /> : null}
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
                                    <div className='panel horizontal-card' onMouseOver={this.onMouseOver.bind(this, thisPlayer.plotDiscard[0])}
                                        onMouseOut={this.onMouseOut}>
                                        {thisPlayer.plotDiscard.length > 0 ?
                                            <img className='horizontal card' src={'/img/cards/' + thisPlayer.plotDiscard[0].code + '.png'} /> : null}
                                    </div>
                                    <div className='panel horizontal-card' onClick={this.onPlotDeckClick}>
                                        <img className='vertical card' src='/img/cards/cardback.jpg' />

                                        {this.state.showPlotDeck ? <div className='panel plot-popup un-kneeled'>
                                            {plotDeck}
                                        </div> : null}
                                    </div>
                                </div>
                            </div>

                            <PlayerStats gold={thisPlayer.gold} claim={thisPlayer.claim} reserve={thisPlayer.reserve}
                                power={thisPlayer.totalPower} />
                        </div>
                        <div className='inset-pane'>
                            <div />
                            <div className='menu-pane'>
                                <div className='panel'>
                                    <h4>{thisPlayer.menuTitle}</h4>
                                    {buttons}
                                </div>
                            </div>
                        </div>
                        <div className='play-area'>
                            <div className='player-board'>
                                <div>
                                    {otherPlayerCardsInPlay}
                                </div>
                                <div />
                            </div>
                            <div className='player-board our-side'>
                                <div>
                                    {thisPlayerCardsInPlay}
                                </div>
                                <div />
                            </div>
                        </div>
                    </div>
                    <PlayerRow agenda={thisPlayer.agenda} faction={thisPlayer.faction} hand={thisPlayer.hand} isMe
                        onCardClick={this.onCardClick} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} />
                </div>
                <div className='right-side'>
                    <div className='card-large'>
                        {this.state.cardToZoom ? <img src={'/img/cards/' + this.state.cardToZoom.code + '.png'} /> : null}
                    </div>
                    <div className='messages panel'>
                        chatbox
                    </div>
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

