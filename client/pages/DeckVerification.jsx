import React, { useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Table, Row, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import Panel from '../Components/Site/Panel';
import { loadFlaggedDecks, verifyDeck, clearApiStatus, selectFlaggedDeck } from '../redux/actions';
import { sortBy } from '../../server/Array';
import AlertPanel from '../Components/Site/AlertPanel';
import { Decks } from '../redux/types';
import ApiStatus from '../Components/Site/ApiStatus';

import AmberImage from '../assets/img/enhancements/amberui.png';
import CaptureImage from '../assets/img/enhancements/captureui.png';
import DrawImage from '../assets/img/enhancements/drawui.png';
import DamageImage from '../assets/img/enhancements/damageui.png';

import './DeckVerification.scss';

const EnhancementImages = {
    amber: AmberImage,
    capture: CaptureImage,
    draw: DrawImage,
    damage: DamageImage
};

const DeckVerification = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { decks, selectedDeck } = useSelector((state) => ({
        decks: state.admin.flaggedDecks,
        selectedDeck: state.admin.selectedFlaggedDeck
    }));
    const cardMap = useSelector((state) => state.cards.cards);

    useEffect(() => {
        dispatch(loadFlaggedDecks());
    }, [dispatch]);

    const apiState = useSelector((state) => {
        const retState = state.api[Decks.VerifyDeck];

        if (retState && retState.success) {
            retState.message = t('Deck verified successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.VerifyDeck));
                //dispatch(navigate('/decks/enhancements'));
            }, 3000);
        }

        return retState;
    });

    let cards = selectedDeck
        ? sortBy(
              //sortBy(
              selectedDeck.cards.filter((c) => c.enhancements),
              (c) => c.id
          )
        : []; /*,
        (c) => c.card.house
    )*/

    if (decks.length === 0) {
        return (
            <Col lg={{ span: 8, offset: 2 }}>
                <Panel title={`${t('Verify decks')}`}>
                    <AlertPanel
                        type='info'
                        message={t('There are no decks to verify.')}
                    ></AlertPanel>
                </Panel>
            </Col>
        );
    }

    return (
        <>
            <Col lg={{ span: 12 }}>
                <Row>
                    <Col md={4}>
                        <Panel title={`${t('Verify decks')}`}>
                            <Table className='deck-verification' hover>
                                <thead>
                                    <tr>
                                        <th>Deck Name</th>
                                        <th>User</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {decks?.map((deck) => (
                                        <tr
                                            className={selectedDeck === deck ? 'selected-deck' : ''}
                                            key={deck.id}
                                            onClick={() => dispatch(selectFlaggedDeck(deck))}
                                        >
                                            <td>{deck.name}</td>
                                            <td>{deck.username}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Panel>
                    </Col>
                    <Col md={8}>
                        <Panel title={selectedDeck?.name}>
                            <ApiStatus
                                state={apiState}
                                onClose={() => dispatch(clearApiStatus(Decks.VerifyDeck))}
                            />
                            <Row>
                                <Col md='3'>
                                    <span>
                                        <Trans>Identity Card</Trans>
                                    </span>
                                    <div>&nbsp;</div>
                                    <div className='verify-id-card'>
                                        <img
                                            className='img-fluid verify-image'
                                            src={`/img/deck-verification/${selectedDeck.id}/id-card.png`}
                                        />
                                    </div>
                                </Col>
                                {cards.map((card) => {
                                    return (
                                        <>
                                            <Col md='3'>
                                                <span>{cardMap[card.id].name}</span>
                                                <div>
                                                    <div>
                                                        <Trans>Recorded Enhancements:</Trans>
                                                    </div>
                                                    {card.enhancements.map((enhancement, id) => (
                                                        <img
                                                            key={`on-${enhancement}${id}`}
                                                            className='enhancement-lg'
                                                            src={EnhancementImages[enhancement]}
                                                        />
                                                    ))}
                                                </div>
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
                            <div className='text-center mt-3'>
                                <Button onClick={() => dispatch(verifyDeck(selectedDeck.id))}>
                                    <Trans>Submit</Trans>
                                    &nbsp;
                                    {apiState && apiState.loading && (
                                        <FontAwesomeIcon icon={faCircleNotch} spin />
                                    )}
                                </Button>
                            </div>
                        </Panel>
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default DeckVerification;
