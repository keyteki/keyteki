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
            <div className='mb-2 text-sm font-semibold text-foreground/90'>
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
                        <div className='rounded-md border border-border/45 bg-surface-secondary/30 px-3 py-2 text-center text-sm text-foreground/80 transition-colors hover:border-border/60 hover:bg-surface-secondary/48 peer-checked:border-accent/65 peer-checked:bg-[color:color-mix(in_oklab,var(--brand-red)_12%,var(--surface))] peer-checked:text-foreground'>
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
