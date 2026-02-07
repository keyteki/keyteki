import React from 'react';

import TypeaheadLookup from './TypeaheadLookup';

/**
 * @typedef TraitNameLookupProps
 * @property {object[]} cards map of card id to cards
 * @property {function(Object): void} onValueSelected Called when a card is selected
 */

/**
 * @param {TraitNameLookupProps} props
 */
const TraitNameLookup = (props) => {
    let cards = Object.values(props.cards);
    let allTraits = cards.reduce((traits, card) => traits.concat(card.traits || []), []);
    let uniqueTraits = [...new Set(allTraits)];

    uniqueTraits = [...uniqueTraits].sort();

    return <TypeaheadLookup values={uniqueTraits} onValueSelected={props.onValueSelected} />;
};

TraitNameLookup.displayName = 'TraitNameLookup';
export default TraitNameLookup;
