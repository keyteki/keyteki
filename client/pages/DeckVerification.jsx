import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Table, Row } from 'react-bootstrap';

import Panel from '../Components/Site/Panel';
import { loadFlaggedDecks } from '../redux/actions';
import { sortBy } from '../../server/Array';

const DeckVerification = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { decks, selectedDeck } = useSelector((state) => ({
        decks: state.admin.flaggedDecks,
        selectedDeck: state.admin.selectedFlaggedDeck
    }));

    useEffect(() => {
        dispatch(loadFlaggedDecks());
    }, [dispatch]);

    let cards = sortBy(
        //sortBy(
        selectedDeck.cards.filter((c) => c.enhancements),
        (c) => c.id
    ); /*,
        (c) => c.card.house
    )*/

    return (
        <>
            <Col lg={{ span: 12 }}>
                <Row>
                    <Col md={4}>
                        <Panel title={`${t('Verify decks')}`}>
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>Deck Name</th>
                                        <th>User</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {decks?.map((deck) => (
                                        <tr key={deck.id}>
                                            <td>{deck.name}</td>
                                            <td>{deck.username}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Panel>
                    </Col>
                    <Col md={8}>
                        <Panel title={selectedDeck.name}>
                            <Row>
                                {cards.map((card) => {
                                    return (
                                        <>
                                            <Col md='3'>
                                                <span>{card.id}</span>
                                                <div>
                                                    <img
                                                        className='img-fluid verify-image'
                                                        src={`/img/deck-verification/${selectedDeck.id}/${card.dbId}.png`}
                                                    />
                                                </div>
                                            </Col>
                                        </>
                                    );
                                })}
                            </Row>
                        </Panel>
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default DeckVerification;
