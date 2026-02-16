import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import Typeahead from '../Form/Typeahead';

/**
 * @typedef TypeaheadLookupProps
 * @property {string[]} values typeahead values
 * @property {function(Object): void} onValueSelected Called when a value is selected
 */

/**
 * @param {TypeaheadLookupProps} props
 */
const TypeaheadLookup = (props) => {
    let [selectedValue, setSelectedValue] = useState();

    const handleDoneClick = () => {
        if (selectedValue) {
            props.onValueSelected(selectedValue);
        }
    };

    return (
        <div>
            <Typeahead
                labelKey={'label'}
                id={props.id || 'typeahead-lookup'}
                options={props.values}
                dropup
                onChange={(selectedValues) => setSelectedValue(selectedValues[0])}
            />
            <button
                type='button'
                onClick={handleDoneClick}
                className='rounded-md border border-zinc-600/80 bg-zinc-800/70 px-3 py-1.5 text-sm text-zinc-100 transition hover:bg-zinc-700/80'
            >
                <Trans>Done</Trans>
            </button>
        </div>
    );
};

TypeaheadLookup.displayName = 'TypeaheadLookup';
export default TypeaheadLookup;
