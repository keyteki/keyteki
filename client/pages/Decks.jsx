import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Navigation/Link';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import ApiStatus from '../Components/Site/ApiStatus';
import TagManagementModal from '../Components/Tags/TagManagementModal';
import { Decks } from '../redux/types';
import { clearApiStatus } from '../redux/actions';

const DecksComponent = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [showTagModal, setShowTagModal] = useState(false);
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
    const { selectedDeck } = useSelector((state) => ({
        selectedDeck: state.cards.selectedDeck
    }));

    return (
        <div className='full-height'>
            <Col sm={12}>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Decks.DeleteDeck))}
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

            <TagManagementModal show={showTagModal} onHide={() => setShowTagModal(false)} />
        </div>
    );
};

DecksComponent.displayName = 'Decks';

export default DecksComponent;
