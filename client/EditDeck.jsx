import React from 'react';
import PropTypes from 'prop-types';
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
            content = (
                <div>
                    <div className='col-sm-6'>
                        <div className='panel-title text-center'>
                            Deck Editor
                        </div>
                        <div className='panel'>
                            <DeckEditor mode='Save' onDeckSave={ this.onEditDeck } />
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='panel-title text-center col-xs-12'>
                            { this.props.deck.name }
                        </div>
                        <div className='panel col-xs-12'>
                            <DeckSummary cards={ this.props.cards } deck={ this.props.deck } />
                        </div>
                    </div>
                </div>);
        }

        return content;
    }
}

InnerEditDeck.displayName = 'InnerEditDeck';
InnerEditDeck.propTypes = {
    agendas: PropTypes.object,
    apiError: PropTypes.string,
    banners: PropTypes.array,
    cards: PropTypes.object,
    deck: PropTypes.object,
    deckId: PropTypes.string,
    deckSaved: PropTypes.bool,
    factions: PropTypes.object,
    loadDeck: PropTypes.func,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    packs: PropTypes.array,
    saveDeck: PropTypes.func,
    setUrl: PropTypes.func
};

function mapStateToProps(state) {
    return {
        agendas: state.cards.agendas,
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
