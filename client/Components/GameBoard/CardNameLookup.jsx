import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import Typeahead from '../Form/Typeahead';

/**
 * @typedef TypeaheadLookupProps
 * @property {object[]} cards map of card id to cards
 * @property {function(Object): void} useState Called when a card name is selected
 */

/**
 * @param {CardNameLookupProps} props
 */
const CardNameLookup = (props) => {
    const [cardName, setCardName] = useState();

    let cardNames = [...new Set(Object.values(props.cards).map((card) => card.name))];
    cardNames.sort();

    const onDoneClick = () => {
        if (cardName) {
            props.onCardSelected(cardName);
        }
    };

    return (
        <div>
            <Typeahead
                labelKey={'label'}
                options={cardNames}
                dropup
                onChange={(cards) => setCardName(cards[0])}
            />
            <button type='button' onClick={onDoneClick} className='btn btn-primary'>
                <Trans>Done</Trans>
            </button>
        </div>
    );
};

CardNameLookup.displayName = 'CardNameLookup';
export default CardNameLookup;
