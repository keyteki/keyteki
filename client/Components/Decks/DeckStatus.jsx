import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Chip, Divider, Tooltip } from '@heroui/react';

import DeckStatusSummary from './DeckStatusSummary';
import LoadingSpinner from '../Site/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleCheck,
    faExclamationCircle,
    faXmarkCircle
} from '@fortawesome/free-solid-svg-icons';

function deckStatusLabel(status) {
    if (!status) {
        return null;
    }

    if (!status.basicRules) {
        return 'Invalid';
    }

    if (!status.valid) {
        return 'Not Legal';
    }

    if (!status.noUnreleasedCards) {
        return 'Casual';
    }

    return 'Legal';
}

const DeckStatus = ({ className, showDeckDetails = true, compact = false, status }) => {
    const { t } = useTranslation();
    const [pointerType, setPointerType] = useState(false);

    const statusInfo = (status) => {
        const label = deckStatusLabel(status) || 'Loading...';
        let icon = <LoadingSpinner size='sm' label={false} />;
        switch (label) {
            case 'Invalid':
                icon = <FontAwesomeIcon icon={faExclamationCircle} />;
                break;
            case 'Not Legal':
                icon = <FontAwesomeIcon icon={faXmarkCircle} />;
                break;
            case 'Casual':
            case 'Legal':
                icon = <FontAwesomeIcon icon={faCircleCheck} />;
                break;
        }

        let color = 'default';
        if (label === 'Invalid' || label === 'Not Legal') {
            color = 'danger';
        } else if (label === 'Casual') {
            color = 'warning';
        } else if (label === 'Legal') {
            color = 'success';
        }

        return { label, icon, color };
    };

    const info = statusInfo(status);

    const wrapperClass = useMemo(
        () =>
            classNames({
                'select-none': ['touch', 'pen'].includes(pointerType) // Disables text selection on touch/pen devices, but not desktop
            }),
        [pointerType]
    );

    const chipClass = classNames('pointer-events-none h-8', className);

    let labelClass = null;
    // Compacts if true, or at the provided size step
    if (compact === true) {
        labelClass = 'hidden';
    } else if (typeof compact === 'string') {
        labelClass = `${compact}:hidden`;
    }

    return (
        <Tooltip
            placement={'right'}
            showArrow={true}
            closeDelay={100}
            isOpen={!!pointerType}
            content={
                <div className='flex flex-col gap-1 max-w-64'>
                    <span className={`text-${info.color} flex flex-row gap-1 items-center`}>
                        {info.icon}
                        <b>{info.label}</b>
                    </span>
                    <Divider />
                    {/* <DeckStatusSummary status={status} /> */}
                    {showDeckDetails && status.extendedStatus?.length > 0 && (
                        <ul className='flex flex-col gap-1'>
                            {status.extendedStatus.map((error, index) => (
                                <li key={index}>
                                    <Divider />
                                    {error}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            }
        >
            <div
                className={wrapperClass}
                onPointerEnter={(e) => setPointerType(e.pointerType)}
                onPointerLeave={() => setPointerType(null)}
            >
                <Chip className={chipClass} color={info.color} radius='md'>
                    <div className='flex flex-row gap-1 items-center'>
                        <span>{info.icon}</span>
                        <span className={labelClass}>{info.label}</span>
                    </div>
                </Chip>
            </div>
        </Tooltip>
    );
};

export default DeckStatus;
