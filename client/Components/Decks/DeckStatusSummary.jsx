import React from 'react';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import './DeckStatusSummary.scss';

const DeckStatusSummary = ({ status }) => {
    let { flagged, verified, noUnreleasedCards } = status;
    let items = [{ title: 'Only released cards', value: noUnreleasedCards }];
    if (verified) {
        items.push({ title: 'Deck verified', value: true });
    } else if (flagged) {
        items.push({ title: 'Deck requires verification', value: false });
    }

    return (
        <ul className='deck-status-summary'>
            {items.map((item, index) => (
                <li className={item.value ? 'valid' : 'invalid'} key={index}>
                    <FontAwesomeIcon icon={item.value ? faCheck : faTimes} />
                    &nbsp;<Trans>{item.title}</Trans>
                </li>
            ))}
        </ul>
    );
};

export default DeckStatusSummary;
