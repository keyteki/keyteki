import React from 'react';
import {connect} from 'react-redux';
import _ from 'underscore';

import PlayerStats from 'GameComponents/PlayerStats.jsx';
import * as actions from './actions';

class InnerGameBoard extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onPlotDeckClick = this.onPlotDeckClick.bind(this);
        this.onPlotCardClick = this.onPlotCardClick.bind(this);

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

    onPlotDeckClick() {
        this.setState({ showPlotDeck: !this.state.showPlotDeck });
    }

    onPlotCardClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ selectedPlot: card });
    }

    isButtonDisabled(button) {
        if(button.command === 'selectplot') {
            return !this.state.selectedPlot;
        }

        return false;
    }
    
    renderHand(hand, isMe) {
        var cardIndex = 0;

        return _.map(hand, card => {
            var retCard = (
                <div key={ cardIndex.toString() + card.code } className='card' onMouseOver={ this.onMouseOver.bind(this, card) } onMouseOut={ this.onMouseOut }
                    onClick={ isMe ? this.onCardClick.bind(this, card) : null }>
                    <img src={ '/img/cards/' + (card.code ? (card.code + '.png') : 'cardback.jpg') } />
                </div>);
            cardIndex++;

            return retCard;
        });
    }

    render() {
        if(!this.props.state) {
            return <div>Waiting for server...</div>;
        }

        var thisPlayer = this.props.state.players[this.props.socket.id];
        var otherPlayer = _.find(this.props.state.players, player => {
            return player.id !== this.props.socket.id;
        });

        var thisPlayerHand = this.renderHand(thisPlayer.hand, true);
        var otherPlayerHand = otherPlayer ? this.renderHand(otherPlayer.hand, false) : [];

        var index = 0;
        var thisPlayerCardsInPlay = _.map(thisPlayer.cardsInPlay, card => {
            var cardInPlay = (<div key={ 'card' + index.toString() } className='card' onMouseOver={ this.onMouseOver.bind(this, card.card) } onMouseOut={ this.onMouseOut }>
                { card.facedown ? <img src='/img/cards/cardback.jpg' /> : <img src={ '/img/cards/' + card.card.code + '.png' } /> }
            </div>);

            index++;

            return cardInPlay;
        });

        index = 0;
        var otherPlayerCardsInPlay = otherPlayer ? _.map(otherPlayer.cardsInPlay, card => {
            var cardInPlay = (<div key={ 'card' + index.toString() } className='card' onMouseOver={ card.facedown ? null : this.onMouseOver.bind(this, card.card) }
                onMouseOut={ card.facedown ? null : this.onMouseOut }>
                { card.facedown ? <img src='/img/cards/cardback.jpg' /> : <img src={ '/img/cards/' + card.card.code + '.png' } /> }
            </div>);

            index++;

            return cardInPlay;
        }) : null;

        index = 0;
        var thisPlayerPlotDeck = _.map(thisPlayer.plotDeck, card => {
            var plotClass = 'plot-card';

            if(card === this.state.selectedPlot) {
                plotClass += ' selected';
            }

            var plotCard = (<div key={ 'card' + index.toString() } className={ plotClass } onMouseOver={ this.onMouseOver.bind(this, card) }
                onMouseOut={ this.onMouseOut } onClick={ (event) => this.onPlotCardClick(event, card) }>
                <img src={ '/img/cards/' + card.code + '.png' } />
            </div>);

            index++;

            return plotCard;
        });

        var buttons = _.map(thisPlayer.buttons, button => {
            return (<button key={ button.command } className='btn btn-primary' onClick={ (event) => this.onButtonClick(event, button.command) }
                disabled={ this.isButtonDisabled(button) }>{ button.text }</button>);
        });

        return (
            <div className='game-board'>
                <div className='main-window'>
                    <div className='player-home-row'>
                        <div className='panel hand'>
                            { otherPlayerHand }
                        </div>
                        <div className='discard panel' />
                        <div className='draw panel'>
                            <div className='card'>
                                <img src='/img/cards/cardback.jpg' />
                            </div>
                        </div>
                        <div className='faction panel'>
                            <div className='card'>
                                { otherPlayer ? <img src={ '/img/factions/' + otherPlayer.faction.value + '.png' } /> : null }
                            </div>
                        </div>
                        <div className='agenda panel'>
                            { otherPlayer && otherPlayer.agenda ?
                                <div className='agenda panel' onMouseOver={ this.onMouseOver.bind(this, otherPlayer.agenda) } onMouseOut={ this.onMouseOut }>
                                    <img src={ '/img/cards/' + otherPlayer.agenda.code + '.png' } />
                                </div>
                                : null
                            }
                        </div>
                        <div className='plot panel'>
                            <img src='/img/cards/cardback.jpg' />
                        </div>
                    </div>
                    <div className='middle'>
                        <div className='left-side'>
                            <PlayerStats gold={ otherPlayer ? otherPlayer.gold : '0' } claim={ otherPlayer ? otherPlayer.claim : '0' }
                                reserve={ otherPlayer ? otherPlayer.reserve : '0' } power={ otherPlayer ? otherPlayer.totalPower : '0' } />    
                            <PlayerStats gold={ thisPlayer.gold } claim={ thisPlayer.claim } reserve={ thisPlayer.reserve }
                                power={ thisPlayer.totalPower } />    
                        </div>
                        <div className='inset-pane'>
                            <div />
                            <div className='menu-pane'>
                                <div className='panel'>
                                    <h4>{ thisPlayer.menuTitle }</h4>
                                    { buttons }
                                </div>
                            </div>
                        </div>
                        <div className='play-area'>
                            <div className='player-board'>
                                <div>
                                    { otherPlayerCardsInPlay }
                                </div>
                                <div />
                            </div>
                            <div className='player-board our-side'>
                                <div>
                                    { thisPlayerCardsInPlay }
                                </div>
                                <div />
                            </div>
                        </div>
                        <div className='plots-pane'>
                            <div>
                                <div className='panel discard-plot opponent'>
                                </div>
                                { otherPlayer && otherPlayer.selectedPlot ? 
                                    otherPlayer.selectedPlot.facedown ? 
                                        <div className='panel discard-plot opponent'>
                                            <img src={ '/img/cards/cardback.jpg' } />
                                        </div> :
                                        <div className='panel plot-deck-card opponent'>
                                            <img src={ '/img/cards/' + otherPlayer.selectedPlot.card.code + '.png' } />
                                        </div> : null 
                                }
                            </div>
                            <div>
                                { thisPlayer.selectedPlot ? 
                                    thisPlayer.selectedPlot.facedown ? 
                                        <div className='panel discard-plot'>
                                            <img src={ '/img/cards/cardback.jpg' } />
                                        </div> :
                                        <div className='panel plot-deck-card'>
                                            <img src={ '/img/cards/' + thisPlayer.selectedPlot.card.code + '.png' } />
                                        </div> : null 
                                }
                                <div className='panel discard-plot'>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='player-home-row'>
                        <div className='panel hand'>
                            { thisPlayerHand }
                        </div>
                        <div className='discard panel' />
                        <div className='draw panel'>
                            <div className='card'>
                                <img src='/img/cards/cardback.jpg' />
                            </div>
                        </div>
                        <div className='faction panel'>
                            <div className='card'>
                                <img src={ '/img/factions/' + thisPlayer.faction.value + '.png' } />
                            </div>
                        </div>
                        { thisPlayer.agenda ?
                            <div className='agenda panel' onMouseOver={ this.onMouseOver.bind(this, thisPlayer.agenda) } onMouseOut={ this.onMouseOut }>
                                <img src={ '/img/cards/' + thisPlayer.agenda.code + '.png' } />
                            </div>
                            : null
                        }
                        <div className='plot our-side panel' onClick={ this.onPlotDeckClick }>
                            <img src='/img/cards/cardback.jpg' />

                            { this.state.showPlotDeck ? <div className='panel plot-popup'>
                                { thisPlayerPlotDeck }
                            </div> : null }
                        </div>
                    </div>
                </div>
                <div className='right-side'>
                    <div className='card-large'>
                        { this.state.cardToZoom ? <img src={ '/img/cards/' + this.state.cardToZoom.code + '.png' } /> : null }
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

