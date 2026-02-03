import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

const OptionsSelect = (props) => {
    const { t } = useTranslation();
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        setSelectedOption(
            props.options && props.options.length > 0 ? `${props.options[0].arg}` : -1
        );
    }, [props.options]);

    const onDoneClicked = (event) => {
        event.preventDefault();

        if (props.onOptionSelected) {
            props.onOptionSelected(selectedOption);
        }
    };

    const options = props.options || [];

    return (
        <div>
            <select
                className='form-control'
                onChange={(event) => setSelectedOption(event.target.value)}
                value={selectedOption ?? -1}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.arg}>
                        {option.text}
                    </option>
                ))}
            </select>
            <button
                className='btn btn-default prompt-button btn-stretch option-button'
                onClick={onDoneClicked}
            >
                {t('Done')}
            </button>
        </div>
    );
};

OptionsSelect.displayName = 'OptionsSelect';
OptionsSelect.propTypes = {
    onOptionSelected: PropTypes.func,
    options: PropTypes.array
};

export default OptionsSelect;
