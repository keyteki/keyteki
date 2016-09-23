import React from 'react';
import {findDOMNode} from 'react-dom';
import {connect} from 'react-redux';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';

import * as actions from './actions';
import {validateDeck} from './deck-validator';

class InnerPendingGame extends React.Component {
    constructor() {
        super();

        this.isGameReady = this.isGameReady.bind(this);
        this.onSelectDeckClick = this.onSelectDeckClick.bind(this);

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
        return this.props.currentGame.player1 && this.props.currentGame.player1.deck &&
            this.props.currentGame.player2 && this.props.currentGame.player2.deck;
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

        var deck = player && !player.deck && playerIsMe ?
            <span className='deck-link' data-toggle='modal' data-target='#decks-modal'>Select deck...</span> :
            playerIsMe ? <span>{player.deck.name}</span> : <span>Deck Selected</span>;

        return <div>{ player ? player.name : null }{ deck }</div>;
    }

    render() {
        var index = 0;
        var decks = this.state.decks ? _.map(this.state.decks, deck => {
            var className = 'deck-row';
            
            if(index === this.state.selectedDeck) {
                className += ' active';
            }

            var validation = validateDeck(deck);

            var deckRow = (                
                <div className={ className } key={ deck.name } onClick={ this.selectDeck.bind(this, index) }>
                    <img className='pull-left' src={ '/img/factions/' + deck.faction.value + '.png' } />
                    <div>{ deck.name }<span className='pull-right'>{ validation.status }</span></div>
                    <div>{ deck.faction.name } 
                        { deck.agenda && deck.agenda.label ? <span>/{deck.agenda.label}</span> : null }
                        <span className='pull-right'>{ moment(deck.lastUpdated).format('Do MMMM YYYY') }</span>
                    </div>
                </div>);

            index++;

            return deckRow;
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
                <div className='button-row'>
                    <button className='btn btn-primary' disabled={ !this.isGameReady() }>Start</button>
                    <button className='btn btn-primary'>Leave</button>
                </div>
                <h3>{ this.props.currentGame.name }</h3>
                <div>Waiting for players...</div>
                <h4>Players</h4>
                { this.getPlayerStatus(this.props.currentGame.player1, this.props.username) }
                { this.getPlayerStatus(this.props.currentGame.player2, this.props.username) }

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

