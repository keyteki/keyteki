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
                    agenda: deck.agenda,
                    provinceCards: deck.provinceCards,
                    drawCards: deck.drawCards,
                    conflictDrawCards: deck.conflictDrawCards,
                    dynastyDrawCards: deck.dynastyDrawCards,
                    bannerCards: deck.bannerCards
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
            agenda: deck.selectedAgenda,
            provinceCards: deck.provinceCards,
            drawCards: deck.drawCards,
            bannerCards: deck.bannerCards
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
            agenda: deck.selectedAgenda,
            provinceCards: deck.provinceCards,
            drawCards: deck.drawCards,
            bannerCards: deck.bannerCards
        });
    }

    render() {
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{this.state.error}</div> : null;

        return (
            <div>
                {errorBar}
                {this.state.loaded ?
                    <div>
                        <DeckEditor agendas={this.props.agendas} cards={this.props.cards} packs={this.props.packs}
                            deckName={this.state.deckName} mode='Save'
                            faction={this.state.faction} agenda={this.state.agenda}
                            provinceCards={this.state.provinceCards} drawCards={this.state.drawCards} conflictDrawCards={this.state.conflictDrawCards} dynastyDrawCards={this.state.dynastyDrawCards} bannerCards={this.state.bannerCards}
                            onDeckChange={this.onDeckChange} onDeckSave={this.onEditDeck} />
                        <DeckSummary className='col-sm-6 right-pane' cards={this.props.cards} name={this.state.deckName} agenda={this.state.agenda}
                            faction={this.state.faction} provinceCards={this.state.provinceCards} drawCards={this.state.drawCards} conflictDrawCards={this.state.conflictDrawCards} dynastyDrawCards={this.state.dynastyDrawCards} bannerCards={this.state.bannerCards} />
                    </div> :
                    <div>Loading deck...</div>}
            </div>);
    }
}

InnerEditDeck.displayName = 'InnerEditDeck';
InnerEditDeck.propTypes = {
    agendas: React.PropTypes.array,
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
