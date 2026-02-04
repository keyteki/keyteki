import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Navigation/Link';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import ApiStatus from '../Components/Site/ApiStatus';
import { cardsActions } from '../redux/slices/cardsSlice';

const DecksComponent = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiState = useSelector((state) =>
        state.cards.deckDeleted ? { success: true, message: t('Deck deleted successfully') } : null
    );
    const { selectedDeck } = useSelector((state) => ({
        selectedDeck: state.cards.selectedDeck
    }));

    return (
        <div className='full-height'>
            <Col sm={12}>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(cardsActions.clearDeckStatus())}
                />
            </Col>
            <Row>
                <Col lg={6} className='full-height'>
                    <Panel title={t('Your decks')}>
                        <Col className='text-center'>
                            <Link className='btn btn-primary' href='/decks/import'>
                                <Trans>Import Deck</Trans>
                            </Link>
                            <Link className='btn btn-primary ml-2' href='/decks/alliance'>
                                <Trans>Build Alliance Deck</Trans>
                            </Link>
                        </Col>
                        <DeckList />
                    </Panel>
                </Col>
                <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} />}</Col>
            </Row>
        </div>
    );
};

DecksComponent.displayName = 'Decks';

export default DecksComponent;
