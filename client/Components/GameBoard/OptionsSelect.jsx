// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../HeroUI/Button';

import { useTranslation } from 'react-i18next';

const OptionsSelect = ({ options, onOptionSelected }) => {
    const { t } = useTranslation();
    const [selectedOption, setSelectedOption] = useState(
        options && options.length > 0 ? '' + options[0].arg : -1
    );

    useEffect(() => {
        if (options && options.length > 0) {
            setSelectedOption('' + options[0].arg);
        }
    }, [options]);

    const onChange = useCallback((event) => {
        setSelectedOption(event.target.value);
    }, []);

    const onDoneClicked = useCallback(
        (event) => {
            event.preventDefault();
            if (onOptionSelected) {
                onOptionSelected(selectedOption);
            }
        },
        [onOptionSelected, selectedOption]
    );

    return (
        <div>
            <select className='form-control' onChange={onChange} value={selectedOption}>
                {options.map((option) => (
                    <option key={option.value} value={option.arg}>
                        {option.text}
                    </option>
                ))}
            </select>
            <Button
                className='prompt-button btn-stretch option-button'
                onPress={onDoneClicked}
                color='default'
            >
                {t('Done')}
            </Button>
        </div>
    );
};

OptionsSelect.displayName = 'OptionsSelect';
OptionsSelect.propTypes = {
    onOptionSelected: PropTypes.func,
    options: PropTypes.array
};

export default OptionsSelect;
