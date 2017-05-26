import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';

import DeckSummary from './DeckSummary.jsx';
import DeckEditor from './DeckEditor.jsx';

import * as actions from './actions';

export class InnerAddDeck extends React.Component {
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
            allianceFaction: deck.selectedAlly,
            provinceCards: deck.provinceCards,
            drawCards: deck.drawCards,
            conflictDrawCards: deck.conflictDrawCards,
            dynastyDrawCards: deck.dynastyDrawCards
        });

        $.ajax({
            url: '/api/decks/',
            type: 'POST',
            data: { data: str },
            cache: false
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
            allianceFaction: deck.selectedAlly,
            provinceCards: deck.provinceCards,
            drawCards: deck.drawCards,
            conflictDrawCards: deck.conflictDrawCards,
            dynastyDrawCards: deck.dynastyDrawCards
        });
    }

    render() {
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{this.state.error}</div> : null;

        return (
            <div >
                {errorBar}
                <DeckEditor alliance={this.state.allianceFaction} cards={this.props.cards} packs={this.props.packs} mode='Add'
                    onDeckChange={this.onDeckChange} onDeckSave={this.onAddDeck} />
                <DeckSummary className='col-sm-6 right-pane' cards={this.props.cards} name={this.state.deckName} alliance={this.state.allianceFaction}
                    faction={this.state.faction} provinceCards={this.state.provinceCards} drawCards={this.state.drawCards} conflictDrawCards={this.state.conflictDrawCards} dynastyDrawCards={this.state.dynastyDrawCards}/>
            </div >);
    }
}

InnerAddDeck.displayName = 'InnerAddDeck';
InnerAddDeck.propTypes = {
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
