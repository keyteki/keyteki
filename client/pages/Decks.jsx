import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Navigation/Link';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import ApiStatus from '../Components/Site/ApiStatus';
import { Decks } from '../redux/types';
import { clearApiStatus } from '../redux/actions';

const DecksComponent = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiState = useSelector((state) => {
        const retState = state.api[Decks.DeleteDeck];

        if (retState && retState.success) {
            retState.message = t('Deck deleted successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.DeleteDeck));
            }, 1000);
        }

        return retState;
    });
    const { cards, selectedDeck } = useSelector((state) => ({
        cards: state.cards.cards,
        selectedDeck: state.cards.selectedDeck
    }));

    const handleDeleteDeck = () => {
        //this.props.deleteDeck(deck);
    };

    return (
        <div className='full-height'>
            <Col sm={12}>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Decks.DeleteDeck))}
                />
            </Col>
            <Row>
                <Col md={6} className='full-height'>
                    <Panel title={t('Your decks')}>
                        <Link className='btn btn-primary' href='/decks/import'>
                            <Trans>Import Deck</Trans>
                        </Link>
                        <DeckList className='deck-list' />
                    </Panel>
                </Col>
                {!!selectedDeck && (
                    <ViewDeck deck={selectedDeck} cards={cards} onDeleteDeck={handleDeleteDeck} />
                )}
            </Row>
        </div>
    );
};

DecksComponent.displayName = 'Decks';

export default DecksComponent;
