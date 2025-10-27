import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Input, Switch } from '@heroui/react';

const GameOptions = ({ formProps }) => {
    const { t } = useTranslation();

    const options = [
        { name: 'allowSpectators', label: t('Allow spectators') },
        { name: 'showHand', label: t('Show hands to spectators') },
        { name: 'muteSpectators', label: t('Mute spectators') },
        { name: 'useGameTimeLimit', label: t('Use a time limit (in minutes)') },
        { name: 'gamePrivate', label: t('Private (requires game link)') },
        { name: 'hideDeckLists', label: t('Hide deck lists') }
    ];

    return (
        <>
            <div className='font-bold mb-2'>
                <Trans>Options</Trans>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {options.map((option) => (
                    <div key={option.name} className='flex items-center gap-2'>
                        <Switch
                            id={option.name}
                            isSelected={!!formProps.values[option.name]}
                            onValueChange={(val) => formProps.setFieldValue(option.name, val)}
                        >
                            {option.label}
                        </Switch>
                    </div>
                ))}
            </div>
            {formProps.values.useGameTimeLimit && (
                <div className='mt-4 max-w-xs'>
                    <Input
                        type='number'
                        label={t('Time Limit')}
                        placeholder={t('Enter time limit')}
                        value={formProps.values.gameTimeLimit}
                        onChange={(e) => formProps.setFieldValue('gameTimeLimit', e.target.value)}
                        isInvalid={!!formProps.errors.gameTimeLimit}
                        errorMessage={formProps.errors.gameTimeLimit}
                    />
                </div>
            )}
        </>
    );
};

export default GameOptions;
