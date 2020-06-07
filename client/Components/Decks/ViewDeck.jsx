import React from 'react';

import ConfirmedButton from '../Form/ConfirmedButton';
import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';

import { Trans } from 'react-i18next';
import { ButtonGroup } from 'react-bootstrap';

/**
 * @typedef ViewDeckProps
 * @property {import('./DeckList').Deck} deck The currently selected deck
 */

/**
 * @param {ViewDeckProps} props
 */
const ViewDeck = ({ deck }) => {
    const handleDeleteClick = () => {
        console.info('fluff');
    };

    return (
        <Panel title={deck.name}>
            <ButtonGroup>
                <ConfirmedButton onClick={handleDeleteClick}>
                    <Trans>Delete</Trans>
                </ConfirmedButton>
            </ButtonGroup>
            <DeckSummary deck={deck} />
        </Panel>
    );
};

export default ViewDeck;
