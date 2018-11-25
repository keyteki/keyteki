import React from 'react';
import PropTypes from 'prop-types';

import ConfirmedButton from '../Form/ConfirmedButton';
import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';

class ViewDeck extends React.Component {
    constructor() {
        super();

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    handleDeleteClick(event) {
        event.preventDefault();
        this.props.onDeleteDeck(this.props.deck);
    }

    render() {
        let { deck, cards } = this.props;

        return (
            <div className='col-md-7'>
                <Panel title={ deck.name }>
                    <div className='btn-group col-xs-12'>
                        <ConfirmedButton onClick={ this.handleDeleteClick }>Delete</ConfirmedButton>
                    </div>
                    <DeckSummary deck={ deck } cards={ cards } />
                </Panel>
            </div>);
    }
}

ViewDeck.propTypes = {
    cards: PropTypes.object,
    deck: PropTypes.object.isRequired,
    onDeleteDeck: PropTypes.func.isRequired
};

export default ViewDeck;
