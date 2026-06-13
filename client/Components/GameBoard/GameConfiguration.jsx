import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@heroui/react';

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
                    <Switch
                        key={option.id}
                        id={option.id}
                        isSelected={!!optionSettings[option.key]}
                        onChange={(isSelected) => toggleOption(option.key, isSelected)}
                        className='flex w-full cursor-pointer items-center justify-between gap-2 rounded bg-surface-secondary/70 px-2 py-1.5'
                    >
                        <span className='text-sm'>{option.label}</span>
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                    </Switch>
                ))}
            </div>
        </Panel>
    );
};

GameConfiguration.displayName = 'GameConfiguration';

export default GameConfiguration;
