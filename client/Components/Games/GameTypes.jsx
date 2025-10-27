import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { RadioGroup, Radio } from '@heroui/react';

import GameTypeInfo from './GameTypeInfo';

const GameTypes = ({ formProps }) => {
    const { t } = useTranslation();

    const types = [
        { name: 'beginner', label: t('Beginner') },
        { name: 'casual', label: t('Casual') },
        { name: 'competitive', label: t('Competitive') }
    ];

    return (
        <>
            <div className='mb-2'>
                <GameTypeInfo gameType={formProps.values.gameType} />
            </div>
            <div className='font-bold mb-2'>
                <Trans>Type</Trans>
            </div>
            <RadioGroup
                orientation='horizontal'
                value={formProps.values.gameType}
                onValueChange={(val) => formProps.setFieldValue('gameType', val)}
                className='flex flex-wrap gap-3'
            >
                {types.map((type) => (
                    <Radio key={type.name} value={type.name}>
                        {type.label}
                    </Radio>
                ))}
            </RadioGroup>
        </>
    );
};

export default GameTypes;
