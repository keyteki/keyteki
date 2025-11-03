import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import Button from '../HeroUI/Button';

/**
 * @typedef TypeaheadLookupProps
 * @property {string[]} values typeahead values
 * @property {function(Object): void} onValueSelected Called when a value is selected
 */

/**
 * @param {TypeaheadLookupProps} props
 */
const TypeaheadLookup = (props) => {
    let [selectedValue, setSelectedValue] = useState(null);
    let [inputValue, setInputValue] = useState('');

    const handleDoneClick = () => {
        if (selectedValue) {
            props.onValueSelected(selectedValue);
            setSelectedValue(null);
            setInputValue('');
        }
    };

    return (
        <div className='flex items-end gap-3'>
            <Autocomplete
                aria-label='Lookup value'
                className='max-w-md flex-1'
                inputValue={inputValue}
                onInputChange={setInputValue}
                selectedKey={selectedValue || null}
                onSelectionChange={(key) => setSelectedValue(key ?? null)}
            >
                {props.values.map((val) => (
                    <AutocompleteItem key={val}>{val}</AutocompleteItem>
                ))}
            </Autocomplete>
            <Button color='primary' type='button' onPress={handleDoneClick}>
                <Trans>Done</Trans>
            </Button>
        </div>
    );
};

TypeaheadLookup.displayName = 'TypeaheadLookup';
export default TypeaheadLookup;
