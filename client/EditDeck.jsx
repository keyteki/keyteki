import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';

import DeckSummary from './DeckSummary.jsx';
import DeckEditor from './DeckEditor.jsx';

import * as actions from './actions';

class InnerEditDeck extends React.Component {
    constructor() {
        super();

        this.state = {
            error: '',
            faction: {},
            loaded: false
        };

        this.onEditDeck = this.onEditDeck.bind(this);
        this.onDeckChange = this.onDeckChange.bind(this);
    }

    componentWillMount() {
        $.get('/api/decks/' + this.props.deckId)
            .done(data => {
                if(!data.success) {
                    this.setState({ error: data.message });
                    return;
                }

                var deck = data.deck;

                this.setState({
                    loaded: true,
                    deckName: deck.name,
                    faction: deck.faction,
                    allianceFaction: deck.allianceFaction,
                    provinceCards: deck.provinceCards,
                    stronghold: deck.stronghold,
                    conflictDrawCards: deck.conflictDrawCards,
                    dynastyDrawCards: deck.dynastyDrawCards
                });
            })
            .fail(() => {
                this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
            });
    }

    onEditDeck(deck) {
        var str = JSON.stringify({
            deckName: deck.name,
            faction: deck.selectedFaction,
            allianceFaction: deck.selectedAlly,
            provinceCards: deck.provinceCards,
            stronghold: deck.stronghold,
            conflictDrawCards: deck.conflictDrawCards,
            dynastyDrawCards: deck.dynastyDrawCards
        });

        $.ajax({
            url: '/api/decks/' + this.props.deckId,
            type: 'PUT',
            data: { data: str }
        }).done(data => {
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
            stronghold: deck.stronghold,
            conflictDrawCards: deck.conflictDrawCards,
            dynastyDrawCards: deck.dynastyDrawCards
        });
    }

    render() {
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{this.state.error}</div> : null;

        return (
            <div>
                {errorBar}
                {this.state.loaded ?
                    <div>
                        <DeckEditor cards={this.props.cards} packs={this.props.packs}
                            deckName={this.state.deckName} mode='Save'
                            faction={this.state.faction} allianceFaction={this.state.allianceFaction}
                            provinceCards={this.state.provinceCards} stronghold={this.state.stronghold} conflictDrawCards={this.state.conflictDrawCards} dynastyDrawCards={this.state.dynastyDrawCards}
                            onDeckChange={this.onDeckChange} onDeckSave={this.onEditDeck} />
                        <DeckSummary className='col-sm-6 right-pane' cards={this.props.cards} name={this.state.deckName} allianceFaction={this.state.allianceFaction}
                            faction={this.state.faction} provinceCards={this.state.provinceCards} stronghold={this.state.stronghold} conflictDrawCards={this.state.conflictDrawCards} dynastyDrawCards={this.state.dynastyDrawCards} />
                    </div> :
                    <div>Loading deck...</div>}
            </div>);
    }
}

InnerEditDeck.displayName = 'InnerEditDeck';
InnerEditDeck.propTypes = {
    cards: React.PropTypes.array,
    deckId: React.PropTypes.string.isRequired,
    navigate: React.PropTypes.func,
    packs: React.PropTypes.array
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const EditDeck = connect(mapStateToProps, actions)(InnerEditDeck);

export default EditDeck;
