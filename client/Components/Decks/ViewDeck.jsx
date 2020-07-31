import React from 'react';
import { Trans } from 'react-i18next';
import { Col, Button } from 'react-bootstrap';

import ConfirmButton from '../Form/ConfirmButton';
import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';
import { deleteDeck, navigate } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';

/**
 * @typedef ViewDeckProps
 * @property {import('./DeckList').Deck} deck The currently selected deck
 */

/**
 * @param {ViewDeckProps} props
 */
const ViewDeck = ({ deck }) => {
    const dispatch = useDispatch();
    const selectedDeck = useSelector((state) => state.cards.selectedDeck);

    const handleDeleteClick = () => {
        dispatch(deleteDeck(deck));
    };

    const isDeckValid = (deck) => {
        if (!deck) {
            return true;
        }

        if (deck.status.verified) {
            return true;
        }

        return !deck.status.notVerified;
    };

    return (
        <Panel title={deck.name}>
            <Col className='text-center'>
                <ConfirmButton onClick={handleDeleteClick}>
                    <Trans>Delete</Trans>
                </ConfirmButton>
                {!isDeckValid(selectedDeck) && (
                    <Button variant='secondary' onClick={() => dispatch(navigate('/decks/verify'))}>
                        <Trans>Verify Deck</Trans>
                    </Button>
                )}
            </Col>
            <DeckSummary deck={deck} />
        </Panel>
    );
};

export default ViewDeck;
