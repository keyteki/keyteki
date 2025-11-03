import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/react';

import DeckStatusSummary from './DeckStatusSummary';

const DeckStatus = ({ status }) => {
    const { t } = useTranslation();

    let statusName;
    const isInvalid = !status.basicRules;
    const isNotVerified = status.basicRules && status.notVerified;
    const isUsed = status.usageLevel === 1 && !status.verified;
    const isPopular = status.usageLevel === 2 && !status.verified;
    const isNotorious = status.usageLevel === 3 && !status.verified;
    const isCasual = status.basicRules && status.impossible;
    const isValid =
        (status.usageLevel === 0 || status.verified) &&
        status.basicRules &&
        !status.notVerified &&
        status.noUnreleasedCards &&
        !status.impossible;

    const baseBadge = 'inline-block text-center px-3 py-1.5 border border-black rounded text-black';
    const bgClass = isValid
        ? 'bg-green-500'
        : isCasual || isUsed || isPopular
        ? 'bg-amber-400'
        : isNotorious || isInvalid
        ? 'bg-red-500'
        : isNotVerified
        ? 'bg-sky-400'
        : 'bg-gray-300';
    const className = classNames(baseBadge, bgClass);

    if (!status.basicRules) {
        statusName = t('Invalid');
    } else if (status.notVerified) {
        statusName = t('Enhancements Not Verified');
    } else if (status.usageLevel === 1 && !status.verified) {
        statusName = t('Used');
    } else if (status.usageLevel === 2 && !status.verified) {
        statusName = t('Popular');
    } else if (status.usageLevel === 3 && !status.verified) {
        statusName = t('Notorious');
    } else if (status.impossible) {
        statusName = t('Impossible Deck');
    } else {
        statusName = t('Valid');
    }

    return (
        <Popover placement='right'>
            <PopoverTrigger>
                <span className={className}>{statusName}</span>
            </PopoverTrigger>
            <PopoverContent>
                <div className='p-2 bg-neutral-900 text-white rounded'>
                    <DeckStatusSummary status={status} />
                    {status.extendedStatus && status.extendedStatus.length !== 0 && (
                        <ul className='list-none p-0 mt-1 space-y-1'>
                            {status.extendedStatus.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default DeckStatus;
