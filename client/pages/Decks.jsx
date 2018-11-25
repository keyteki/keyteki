import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Link from '../Components/Site/Link';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import * as actions from '../actions';

class Decks extends React.Component {
    constructor() {
        super();

        this.handleDeleteDeck = this.handleDeleteDeck.bind(this);
    }

    componentWillMount() {
        this.props.loadDecks();
    }

    handleDeleteDeck(deck) {
        this.props.deleteDeck(deck);
    }

    render() {
        let content = null;

        let successPanel = null;

        if(this.props.deckDeleted) {
            setTimeout(() => {
                this.props.clearDeckStatus();
            }, 5000);
            successPanel = (
                <AlertPanel message='Deck deleted successfully' type={ 'success' } />
            );
        }

        if(this.props.apiLoading) {
            content = <div>Loading decks from the server...</div>;
        } else if(!this.props.apiSuccess) {
            content = <AlertPanel type='error' message={ this.props.apiMessage } />;
        } else {
            content = (
                <div className='full-height'>
                    <div className='col-xs-12'>
                        { successPanel }
                    </div>
                    <div className='col-md-5 full-height'>
                        <Panel title='Your decks'>
                            <Link className='btn btn-primary' href='/decks/import'>Import Deck</Link>
                            <DeckList className='deck-list' activeDeck={ this.props.selectedDeck } decks={ this.props.decks } onSelectDeck={ this.props.selectDeck } />
                        </Panel>
                    </div>
                    { !!this.props.selectedDeck &&
                        <ViewDeck deck={ this.props.selectedDeck } cards={ this.props.cards } onDeleteDeck={ this.handleDeleteDeck } />
                    }
                </div>);
        }

        return content;
    }
}

Decks.displayName = 'Decks';
Decks.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    cards: PropTypes.object,
    clearDeckStatus: PropTypes.func,
    deckDeleted: PropTypes.bool,
    decks: PropTypes.array,
    deleteDeck: PropTypes.func,
    loadDecks: PropTypes.func,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    selectDeck: PropTypes.func,
    selectedDeck: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.loading : undefined,
        apiMessage: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.message : undefined,
        apiSuccess: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.success : undefined,
        cards: state.cards.cards,
        deckDeleted: state.cards.deckDeleted,
        decks: state.cards.decks,
        loading: state.api.loading,
        selectedDeck: state.cards.selectedDeck
    };
}

export default connect(mapStateToProps, actions)(Decks);
