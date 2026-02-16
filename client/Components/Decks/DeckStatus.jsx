import React from 'react';
import classNames from 'classnames';
import { Popover } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import DeckStatusSummary from './DeckStatusSummary';

const DeckStatus = ({ status }) => {
    const { t } = useTranslation();

    let statusName;
    const className = classNames('deck-status', {
        invalid: !status.basicRules,
        'not-verified': status.basicRules && status.notVerified,
        used: status.usageLevel === 1 && !status.verified,
        popular: status.usageLevel === 2 && !status.verified,
        notorious: status.usageLevel === 3 && !status.verified,
        'casual-play': status.basicRules && status.impossible,
        valid:
            (status.usageLevel === 0 || status.verified) &&
            status.basicRules &&
            !status.notVerified &&
            status.noUnreleasedCards &&
            !status.impossible
    });

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
            <Popover.Trigger>
                <span className={className}>{statusName}</span>
            </Popover.Trigger>
            <Popover.Content>
                <div>
                    <DeckStatusSummary status={status} />
                    {status.extendedStatus && status.extendedStatus.length !== 0 ? (
                        <ul className='deck-status-errors'>
                            {status.extendedStatus.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            </Popover.Content>
        </Popover>
    );
};

export default DeckStatus;
