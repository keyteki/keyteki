import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import Button from '../HeroUI/Button';

/**
 * @typedef CardNameLookupProps
 * @property {object[]} cards map of card id to cards
 * @property {function(Object): void} useState Called when a card name is selected
 */

/**
 * @param {CardNameLookupProps} props
 */
const CardNameLookup = (props) => {
    const [cardName, setCardName] = useState(null);
    const [inputValue, setInputValue] = useState('');

    let cardNames = [...new Set(Object.values(props.cards).map((card) => card.name))];
    cardNames.sort();

    const onDoneClick = () => {
        if (cardName) {
            props.onCardSelected(cardName);
            setCardName(null);
            setInputValue('');
        }
    };

    return (
        <div className='flex items-end gap-3'>
            <Autocomplete
                aria-label='Card name'
                className='max-w-md flex-1'
                inputValue={inputValue}
                onInputChange={setInputValue}
                selectedKey={cardName || null}
                onSelectionChange={(key) => setCardName(key ?? null)}
            >
                {cardNames.map((name) => (
                    <AutocompleteItem key={name}>{name}</AutocompleteItem>
                ))}
            </Autocomplete>
            <Button color='primary' type='button' onPress={onDoneClick}>
                <Trans>Done</Trans>
            </Button>
        </div>
    );
};

CardNameLookup.displayName = 'CardNameLookup';
export default CardNameLookup;
