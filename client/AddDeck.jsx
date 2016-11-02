import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';

import DeckSummary from './DeckSummary.jsx';
import DeckEditor from './DeckEditor.jsx';

import * as actions from './actions';

class InnerAddDeck extends React.Component {
    constructor() {
        super();

        this.state = {
            error: '',
            faction: {}
        };

        this.onAddDeck = this.onAddDeck.bind(this);
        this.onDeckChange = this.onDeckChange.bind(this);
    }

    onAddDeck(deck) {
        var str = JSON.stringify({
            deckName: deck.name,
            faction: deck.selectedFaction,
            agenda: deck.selectedAgenda,
            plotCards: deck.plotCards,
            drawCards: deck.drawCards
        });

        $.ajax({
            url: '/api/decks/',
            type: 'POST',
            data: { data: str }
        }).done((data) => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.props.navigate('/decks');
        }).fail(() => {
            this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
        });
    }

    onDeckChange(deck) {
        this.setState({
            deckName: deck.name,
            faction: deck.selectedFaction,
            agenda: deck.selectedAgenda,
            plotCards: deck.plotCards,
            drawCards: deck.drawCards
        });
    }

    render() {
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{this.state.error}</div> : null;

        return (
            <div >
                {errorBar}
                < DeckEditor agendas={this.props.agendas} cards={this.props.cards} mode='Add'
                    onDeckChange={this.onDeckChange} onDeckSave={this.onAddDeck} />
                <DeckSummary className='col-sm-6 right-pane' cards={this.props.cards} name={this.state.deckName} agenda={this.state.agenda}
                    faction={this.state.faction} plotCards={this.state.plotCards} drawCards={this.state.drawCards} />
            </div >);
    }
}

InnerAddDeck.displayName = 'InnerAddDeck';
InnerAddDeck.propTypes = {
    agendas: React.PropTypes.array,
    cards: React.PropTypes.array,
    navigate: React.PropTypes.func,
    packs: React.PropTypes.array
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const AddDeck = connect(mapStateToProps, actions)(InnerAddDeck);

export default AddDeck;
