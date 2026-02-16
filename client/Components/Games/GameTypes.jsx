import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import GameTypeInfo from './GameTypeInfo';

const GameTypes = ({ formProps }) => {
    const { t } = useTranslation();

    const types = [
        { name: 'beginner', label: t('Beginner') },
        { name: 'casual', label: t('Casual') },
        { name: 'competitive', label: t('Competitive') }
    ];

    return (
        <div className='mt-3'>
            <div className='mb-2 text-sm font-semibold text-zinc-100'>
                <Trans>Type</Trans>
            </div>
            <div className='grid gap-2 sm:grid-cols-3'>
                {types.map((type) => (
                    <label className='block cursor-pointer' key={type.name}>
                        <input
                            checked={formProps.values.gameType === type.name}
                            className='peer sr-only'
                            name='gameType'
                            onChange={() => formProps.setFieldValue('gameType', type.name)}
                            type='radio'
                            value={type.name}
                        />
                        <div className='rounded-md border border-white/10 bg-surface-secondary/35 px-3 py-2 text-center text-sm text-zinc-200 transition-colors hover:bg-surface-secondary/55 peer-checked:border-accent/70 peer-checked:bg-accent/10 peer-checked:text-zinc-100'>
                            {type.label}
                        </div>
                    </label>
                ))}
            </div>
            <div className='mt-2'>
                <GameTypeInfo gameType={formProps.values.gameType} />
            </div>
        </div>
    );
};

export default GameTypes;
