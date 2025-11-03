import React from 'react';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

const DeckStatusSummary = ({ status }) => {
    let { flagged, verified, noUnreleasedCards, basicRules } = status;
    let items = [
        { title: 'Only released cards', value: noUnreleasedCards },
        { title: 'Enhancements set', value: basicRules }
    ];
    if (verified) {
        items.push({ title: 'Deck verified', value: true });
    } else if (flagged) {
        items.push({ title: 'Deck requires verification', value: false });
    }

    return (
        <ul className='text-xs space-y-1'>
            {items.map((item, index) => (
                <li className={item.value ? 'text-green-500' : 'text-red-500'} key={index}>
                    <FontAwesomeIcon icon={item.value ? faCheck : faTimes} />
                    &nbsp;<Trans>{item.title}</Trans>
                </li>
            ))}
        </ul>
    );
};

export default DeckStatusSummary;
