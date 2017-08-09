import React from 'react';
import { connect } from 'react-redux';

import DeckSummary from './DeckSummary.jsx';
import DeckEditor from './DeckEditor.jsx';
import AlertPanel from './SiteComponents/AlertPanel.jsx';

import * as actions from './actions';

class InnerEditDeck extends React.Component {
    constructor() {
        super();

        this.onEditDeck = this.onEditDeck.bind(this);
    }

    componentWillMount() {
        if(this.props.deckId) {
            return this.props.loadDeck(this.props.deckId);
        } else if(this.props.deck) {
            this.props.setUrl('/decks/edit/' + this.props.deck._id);

            return this.props.loadDeck(this.props.deck._id);
        }
    }

    componentWillUpdate() {
        if(this.props.deckSaved) {
            this.props.navigate('/decks');

            return;
        }
    }

    onEditDeck(deck) {
        this.props.saveDeck(deck);
    }

    render() {
        let content;

        if(this.props.loading) {
            content = <div>Loading decks from the server...</div>;
        } else if(this.props.apiError) {
            content = <AlertPanel type='error' message={ this.props.apiError } />;
        } else if(!this.props.deck) {
            content = <AlertPanel message='The specified deck was not found' type='error' />;
        } else {
            content = (<div>
                { <DeckEditor mode='Save' onDeckSave={ this.onEditDeck } /> }
                <DeckSummary className='col-sm-6 right-pane' cards={ this.props.cards } deck={ this.props.deck } />
            </div>);
        }

        return content;
    }
}

InnerEditDeck.displayName = 'InnerEditDeck';
InnerEditDeck.propTypes = {
    alliances: React.PropTypes.object,
    apiError: React.PropTypes.string,
    banners: React.PropTypes.array,
    cards: React.PropTypes.object,
    deck: React.PropTypes.object,
    deckId: React.PropTypes.string,
    deckSaved: React.PropTypes.bool,
    factions: React.PropTypes.object,
    loadDeck: React.PropTypes.func,
    loading: React.PropTypes.bool,
    navigate: React.PropTypes.func,
    packs: React.PropTypes.array,
    saveDeck: React.PropTypes.func,
    setUrl: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        alliances: state.cards.factions,
        apiError: state.api.message,
        banners: state.cards.banners,
        cards: state.cards.cards,
        deck: state.cards.selectedDeck,
        deckSaved: state.cards.deckSaved,
        factions: state.cards.factions,
        loading: state.api.loading,
        socket: state.socket.socket
    };
}

const EditDeck = connect(mapStateToProps, actions)(InnerEditDeck);

export default EditDeck;
