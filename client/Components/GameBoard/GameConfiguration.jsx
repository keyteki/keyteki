import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Switch } from '@heroui/react';

import Panel from '../Site/Panel';

const GameConfiguration = ({ optionSettings, onOptionSettingToggle }) => {
    const { t } = useTranslation();

    const toggleOption = (key, checked) => {
        onOptionSettingToggle(key, checked);
    };

    const options = [
        {
            id: 'orderForcedAbilities',
            key: 'orderForcedAbilities',
            label: t('Prompt to order simultaneous abilities')
        },
        {
            id: 'confirmOneClick',
            key: 'confirmOneClick',
            label: t('Show a prompt when initiating 1-click abilities')
        },
        {
            id: 'useHalfSizedCards',
            key: 'useHalfSizedCards',
            label: t('Use half sized card images')
        }
    ];

    return (
        <Panel title={t('Game Settings')} compactHeader>
            <div className='grid gap-2'>
                {options.map((option) => (
                    <div
                        key={option.id}
                        className='flex items-center justify-between gap-2 rounded bg-surface-secondary/70 px-2 py-1.5'
                    >
                        <Label htmlFor={option.id} className='text-sm'>
                            {option.label}
                        </Label>
                        <Switch
                            id={option.id}
                            isSelected={!!optionSettings[option.key]}
                            onChange={(isSelected) => toggleOption(option.key, isSelected)}
                        >
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch>
                    </div>
                ))}
            </div>
        </Panel>
    );
};

GameConfiguration.displayName = 'GameConfiguration';

export default GameConfiguration;
