import React from 'react';
import { Trans } from 'react-i18next';
import { ButtonGroup, Col } from 'react-bootstrap';

import ConfirmButton from '../Form/ConfirmButton';
import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';
import Link from '../../Components/Navigation/Link';
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
            <Col xs={12} className='text-center'>
                <ButtonGroup>
                    <ConfirmButton onClick={handleDeleteClick}>
                        <Trans>Delete</Trans>
                    </ConfirmButton>
                </ButtonGroup>
                <Link className='btn btn-primary ml-2' href='/deckstats'>
                    <Trans>Statistics</Trans>
                </Link>
            </Col>
            <DeckSummary deck={deck} />
        </Panel>
    );
};

export default ViewDeck;
