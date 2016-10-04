import React from 'react';
import {connect} from 'react-redux';
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
        this.onPlotCardSelected = this.onPlotCardSelected.bind(this);

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

    onPlotCardSelected(card) {
        this.setState({ selectedPlot: card });
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

        var buttons = _.map(thisPlayer.buttons, button => {
            return (<button key={ button.command } className='btn btn-primary' onClick={ (event) => this.onButtonClick(event, button.command) }
                disabled={ this.isButtonDisabled(button) }>{ button.text }</button>);
        });

        return (
            <div className='game-board'>
                <div className='main-window'>
                    <PlayerRow agenda={ otherPlayer ? otherPlayer.agenda : undefined } faction={ otherPlayer ? otherPlayer.faction : undefined } hand={ otherPlayer ? otherPlayer.hand : []} isMe={ false } />
                    <div className='middle'>
                        <div className='left-side'>
                            <PlayerStats gold={ otherPlayer ? otherPlayer.gold : 0 } claim={ otherPlayer ? otherPlayer.claim : 0 }
                                reserve={ otherPlayer ? otherPlayer.reserve : 0 } power={ otherPlayer ? otherPlayer.totalPower : 0 } />
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
                                <div className='panel plot-deck-card opponent'>
                                    { otherPlayer && otherPlayer.plotDiscard.length > 0 ?
                                        <img src={ '/img/cards/' + otherPlayer.plotDiscard[0].code + '.png' } /> : null }
                                </div>
                                { otherPlayer && otherPlayer.plotSelected ?
                                    <div className='panel discard-plot opponent'>
                                        <img src='/img/cards/cardback.jpg' />
                                    </div> : null
                                }
                            </div>
                            <div>
                                { thisPlayer.plotSelected ?
                                    <div className='panel discard-plot'>
                                        <img src='/img/cards/cardback.jpg' />
                                    </div> : null
                                }
                                <div className='panel plot-deck-card'>
                                    { thisPlayer.plotDiscard.length > 0 ?
                                        <img src={ '/img/cards/' + thisPlayer.plotDiscard[0].code + '.png' } /> : null }
                                </div>
                            </div>
                        </div>
                    </div>
                    <PlayerRow agenda={ thisPlayer.agenda } faction={ thisPlayer.faction } hand={ thisPlayer.hand } isMe plotDeck={ thisPlayer.plotDeck }
                        onCardClick={ this.onCardClick } onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onPlotCardSelected={ this.onPlotCardSelected } />
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

