import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, ListBox, Select } from '@heroui/react';

import { useTranslation } from 'react-i18next';

const OptionsSelect = (props) => {
    const { t } = useTranslation();
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        setSelectedOption(
            props.options && props.options.length > 0 ? `${props.options[0].arg}` : -1
        );
    }, [props.options]);

    const onDoneClicked = () => {
        if (props.onOptionSelected) {
            props.onOptionSelected(selectedOption);
        }
    };

    const options = props.options || [];

    return (
        <div className='space-y-2'>
            <Select
                aria-label={t('Options')}
                className='w-full'
                value={selectedOption ?? '-1'}
                onChange={(value) => setSelectedOption(String(value))}
            >
                <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                    <ListBox>
                        {options.map((option) => (
                            <ListBox.Item
                                key={`${option.arg}`}
                                id={`${option.arg}`}
                                textValue={option.text}
                            >
                                {option.text}
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Select.Popover>
            </Select>
            <Button
                variant='tertiary'
                className='w-full justify-center !px-3 !py-2.5'
                onPress={onDoneClicked}
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
