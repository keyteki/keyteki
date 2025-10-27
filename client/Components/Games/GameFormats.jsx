import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { RadioGroup, Radio, Switch } from '@heroui/react';

import './GameFormats.scss';

const GameFormats = ({ formProps }) => {
    const { t } = useTranslation();

    const formats = [
        { name: 'normal', label: t('Normal') },
        { name: 'unchained', label: t('Unchained') },
        { name: 'sealed', label: t('Sealed') },
        { name: 'reversal', label: t('Reversal') },
        { name: 'adaptive-bo1', label: t('Adaptive - Best of 1') },
        { name: 'alliance', label: t('Alliance') }
    ];

    let expansions = [
        { name: 'cota', label: t('Call of the Archons') },
        { name: 'aoa', label: t('Age of Ascension') },
        { name: 'wc', label: t('Worlds Collide') },
        { name: 'mm', label: t('Mass Mutation') },
        { name: 'dt', label: t('Dark Tidings') },
        { name: 'woe', label: t('Winds of Exchange') },
        { name: 'gr', label: t('Grim Reminders') },
        { name: 'as', label: t('Amber Skies') }
    ];

    return (
        <>
            <div className='font-bold mb-2'>
                <Trans>Format</Trans>
            </div>
            <RadioGroup
                orientation='horizontal'
                value={formProps.values.gameFormat}
                onValueChange={(val) => formProps.setFieldValue('gameFormat', val)}
                className='flex flex-wrap gap-3'
            >
                {formats.map((format) => (
                    <Radio key={format.name} value={format.name}>
                        {format.label}
                    </Radio>
                ))}
            </RadioGroup>
            {formProps.values.gameFormat === 'sealed' && (
                <div className='game-formats mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                    {expansions.map((expansion) => (
                        <Switch
                            key={expansion.name}
                            isSelected={!!formProps.values[expansion.name]}
                            onValueChange={(val) => formProps.setFieldValue(expansion.name, val)}
                        >
                            {expansion.label}
                        </Switch>
                    ))}
                </div>
            )}
        </>
    );
};

export default GameFormats;
