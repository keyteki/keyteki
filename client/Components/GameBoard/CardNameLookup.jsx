import React from 'react';
import PropTypes from 'prop-types';

import Typeahead from '../Form/Typeahead';

class CardNameLookup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onCardNameChange = this.onCardNameChange.bind(this);
        this.onDoneClick = this.onDoneClick.bind(this);
    }

    onCardNameChange(card) {
        this.setState({ cardName: card[0] });
    }

    onDoneClick() {
        if(this.props.onCardSelected) {
            this.props.onCardSelected(this.state.cardName);
        }
    }

    render() {
        return (
            <div>
                <Typeahead labelKey={ 'label' } options={ [...new Set(Object.values(this.props.cards).map(card => card.name))] } dropup onChange={ this.onCardNameChange } />
                <button type='button' onClick={ this.onDoneClick } className='btn btn-primary'>Done</button>
            </div>);
    }
}

CardNameLookup.displayName = 'CardNameLookup';
CardNameLookup.propTypes = {
    cards: PropTypes.object,
    onCardSelected: PropTypes.object
};

export default CardNameLookup;
