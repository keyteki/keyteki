import React from 'react';
import {findDOMNode} from 'react-dom';
import {connect} from 'react-redux';
import $ from 'jquery';
import _ from 'underscore';

import * as actions from './actions';
import DeckRow from './DeckRow.jsx';

class InnerPendingGame extends React.Component {
    constructor() {
        super();

        this.isGameReady = this.isGameReady.bind(this);
        this.onSelectDeckClick = this.onSelectDeckClick.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.onStartClick = this.onStartClick.bind(this);

        this.state = {
            decks: []
        };
    }

    componentWillMount() {
        $.ajax({
            url: '/api/decks',
            type: 'GET'
        }).done((data) => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.setState({ decks: data.decks });
        }).fail(() => {
            this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
        });
    }

    isGameReady() {
        if(!_.all(this.props.currentGame.players, player => {
            return !!player.deck;
        })) {
            return false;
        }

        var myGame = false;
        _.each(this.props.currentGame.players, player => {
            if(player.id.slice(2) === this.props.socket.id && player.owner) {
                myGame = true;
            }
        });

        return myGame;
    }

    onSelectDeckClick() {
        $(findDOMNode(this.refs.modal)).modal('show');
    }

    selectDeck(index) {
        $(findDOMNode(this.refs.modal)).modal('hide');

        this.props.socket.emit('selectdeck', this.props.currentGame.id, this.state.decks[index]);
    }

    getPlayerStatus(player, username) {
        var playerIsMe = player && player.name === username;

        var deck = null;
        var selectLink = null;

        if(player && player.deck) {
            if(playerIsMe) {
                deck = <span className='deck-selection'>{ player.deck.name }</span>;
                selectLink = <span className='deck-link' data-toggle='modal' data-target='#decks-modal'>Select deck...</span>;
            } else {
                deck = <span className='deck-selection'>Deck Selected</span>;
            }
        } else if(player && playerIsMe) {
            selectLink = <span className='deck-link' data-toggle='modal' data-target='#decks-modal'>Select deck...</span>;
        }

        return <div className='player-row' key={ player.id }>{ player ? <span>{ player.name }</span> : null }{ deck } { selectLink }</div>;
    }

    getGameStatus() {
        if(this.props.currentGame.players.length < 2) {
            return 'Waiting for players...';
        }

        if(!_.all(this.props.currentGame.players, player => {
            return !!player.deck;
        })) {
            return 'Waiting for players to select decks';
        }

        return 'Ready to begin, click start to begin the game';
    }

    onLeaveClick(event) {
        event.preventDefault();

        this.props.socket.emit('leavegame', this.props.currentGame.id);
    }

    onStartClick(event) {
        event.preventDefault();

        this.props.socket.emit('startgame', this.props.currentGame.id);
    }

    render() {
        var index = 0;
        var decks = this.state.decks ? _.map(this.state.decks, deck => {
            var row = <DeckRow key={ deck.name + index.toString() } deck={ deck } onClick={ this.selectDeck.bind(this, index) } active={ index === this.state.selectedDeck } />;

            index++;

            return row;
        }) : null;

        var popup = (
            <div id='decks-modal' ref='modal' className='modal fade' tabIndex='-1' role='dialog'>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content popup'>
                        <div className='modal-header'>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button>
                            <h4 className='modal-title'>Select Deck</h4>
                        </div>
                        <div className='modal-body'>
                            <div className='deck-list'>
                                { decks }
                            </div>
                        </div>
                    </div>
                </div>
            </div>);

        return (
            <div>
                <div className='btn-group'>
                    <button className='btn btn-primary' disabled={ !this.isGameReady() } onClick={ this.onStartClick }>Start</button>
                    <button className='btn btn-primary' onClick={ this.onLeaveClick }>Leave</button>
                </div>
                <h3>{ this.props.currentGame.name }</h3>
                <div>{ this.getGameStatus() }</div>
                <h4>Players</h4>
                {
                    _.map(this.props.currentGame.players, player => {
                        return this.getPlayerStatus(player, this.props.username);
                    })
                }

                { popup }
            </div>);
    }
}

InnerPendingGame.displayName = 'PendingGame';
InnerPendingGame.propTypes = {
    cards: React.PropTypes.array,
    currentGame: React.PropTypes.object,
    socket: React.PropTypes.object,
    username: React.PropTypes.string
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards,
        currentGame: state.games.currentGame,
        socket: state.socket.socket,
        username: state.auth.username
    };
}

const PendingGame = connect(mapStateToProps, actions)(InnerPendingGame);

export default PendingGame;

