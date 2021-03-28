import React from 'react';
import PropTypes from 'prop-types';

import TypeaheadLookup from './TypeaheadLookup';

function TraitNameLookup(props) {
    let cards = Object.values(props.cards);
    let allTraits = cards.reduce((traits, card) => traits.concat(card.traits || []), []);
    let uniqueTraits = [...new Set(allTraits)];

    uniqueTraits.sort();

    return <TypeaheadLookup values={uniqueTraits} onValueSelected={props.onValueSelected} />;
}

TraitNameLookup.displayName = 'TraitNameLookup';
TraitNameLookup.propTypes = {
    cards: PropTypes.object,
    onValueSelected: PropTypes.func
};

export default TraitNameLookup;
