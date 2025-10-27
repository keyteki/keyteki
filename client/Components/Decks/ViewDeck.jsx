import React from 'react';
import { Trans } from 'react-i18next';
import { ButtonGroup } from '@heroui/react';

import ConfirmButton from '../Form/ConfirmButton';
import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';
import { deleteDeck } from '../../redux/actions';
import { useDispatch } from 'react-redux';

/**
 * @typedef ViewDeckProps
 * @property {import('./DeckList').Deck} deck The currently selected deck
 */

/**
 * @param {ViewDeckProps} props
 */
const ViewDeck = ({ deck }) => {
    const dispatch = useDispatch();

    const handleDeleteClick = () => {
        dispatch(deleteDeck(deck));
    };

    return (
        <Panel title={deck.name}>
            <div className='w-full text-center'>
                <ButtonGroup>
                    <ConfirmButton onClick={handleDeleteClick}>
                        <Trans>Delete</Trans>
                    </ConfirmButton>
                </ButtonGroup>
            </div>
            <DeckSummary deck={deck} />
        </Panel>
    );
};

export default ViewDeck;
