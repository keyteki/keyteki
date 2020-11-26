import React, { useState } from 'react';
import { Col, Button, Row, Table } from 'react-bootstrap';
import Panel from '../Components/Site/Panel';
import { useTranslation, Trans } from 'react-i18next';
import AlertPanel from '../Components/Site/AlertPanel';
import { useSelector, useDispatch } from 'react-redux';

import AmberImage from '../assets/img/enhancements/amberui.png';
import CaptureImage from '../assets/img/enhancements/captureui.png';
import DrawImage from '../assets/img/enhancements/drawui.png';
import DamageImage from '../assets/img/enhancements/damageui.png';
import CardImage from '../Components/GameBoard/CardImage';
import { navigate, saveDeckEnhancements, clearApiStatus } from '../redux/actions';
import { Decks } from '../redux/types';
import ApiStatus from '../Components/Site/ApiStatus';
import { sortBy } from '../../server/Array';

import './Enhancements.scss';

const EnhancementImages = {
    amber: AmberImage,
    capture: CaptureImage,
    draw: DrawImage,
    damage: DamageImage
};

const EnhancementLookup = {
    P: 'capture',
    D: 'damage',
    R: 'draw',
    A: 'amber'
};

const Enhancements = () => {
    const { t, i18n } = useTranslation();
    const selectedDeck = useSelector((state) => state.cards.selectedDeck);
    const [enhancedCards, setEnhanceCards] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const apiState = useSelector((state) => {
        const retState = state.api[Decks.SaveEnhancements];

        if (retState && retState.success) {
            retState.message = t('Deck enhancements saved successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.SaveEnhancements));
                dispatch(navigate('/decks'));
            }, 5000);
        }

        return retState;
    });
    let [zoomCard, setZoomCard] = useState(null);
    let [mousePos, setMousePosition] = useState({ x: 0, y: 0 });

    if (!selectedDeck) {
        setTimeout(() => {
            dispatch(navigate('/decks/import'));
        }, 5000);

        return (
            <AlertPanel
                type='warning'
                message={t('This page is not intended to be viewed directly.')}
            ></AlertPanel>
        );
    }

    const enhancementRegex = /Enhance (.+?)\./;

    let enhancements = {};
    let totalEnhancements = 0;
    let totalUsed = 0;

    for (let deckCard of selectedDeck.cards.filter((c) => c.card.text?.includes('Enhance'))) {
        let matches = deckCard.card.text.match(enhancementRegex);
        if (!matches || matches.length === 1) {
            continue;
        }

        let enhancementString = matches[1];
        for (let char of enhancementString) {
            let enhancement = EnhancementLookup[char];
            if (enhancement) {
                for (let i = 0; i < deckCard.count; i++) {
                    enhancements[enhancement] = enhancements[enhancement]
                        ? enhancements[enhancement] + 1
                        : 1;
                    totalEnhancements++;
                }
            }
        }
    }

    let usedEnhancements = {};
    for (const card of Object.values(enhancedCards)) {
        for (let [enhancement, count] of Object.entries(card)) {
            usedEnhancements[enhancement] = usedEnhancements[enhancement]
                ? usedEnhancements[enhancement] + count
                : count;
        }
    }

    let enhancementImages = [];
    for (let [enhancement, count] of Object.entries(enhancements)) {
        let used = usedEnhancements[enhancement] || 0;
        let available = count - used;

        totalUsed += used;

        for (let i = 0; i < used; i++) {
            enhancementImages.push(
                <img
                    key={`off-${enhancement}${i}`}
                    className='enhancement-lg img-noenhance'
                    src={EnhancementImages[enhancement]}
                />
            );
        }

        for (let i = 0; i < available; i++) {
            enhancementImages.push(
                <img
                    key={`on-${enhancement}${i}`}
                    className='enhancement-lg'
                    src={EnhancementImages[enhancement]}
                />
            );
        }
    }

    let cards = sortBy(
        sortBy(
            selectedDeck.cards.filter((c) => c.enhancements),
            (c) => c.card.id
        ),
        (c) => c.card.house
    );

    return (
        <Col md={{ span: 8, offset: 2 }} className='profile full-height'>
            <Panel title={`${t('Assign Enhancements')} - ${selectedDeck.name}`}>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Decks.SaveEnhancements))}
                />
                <AlertPanel>
                    <Trans i18nKey='enhancements.alert'>
                        The deck you have just added contains enhancements. It is not possible for
                        us to determine which cards are enhanced. Please assign the enhancements to
                        the correct cards below. To assign enhancements click on the greyed out
                        enhancement icons. If you make a mistake click on the regular icon to remove
                        it. Please make sure these are correct as they cannot be changed later!
                    </Trans>
                </AlertPanel>
                {errorMessage && <AlertPanel type='danger' message={errorMessage} />}
                <Row>
                    <Col sm='6'>
                        <h4>
                            <Trans>Cards to enhance</Trans>
                        </h4>
                        <Table striped className='enhancements'>
                            <tbody>
                                {cards.map((c) => {
                                    let existingEnhancements = [];

                                    if (enhancedCards[c.dbId]) {
                                        for (const enhancement of Object.keys(
                                            enhancedCards[c.dbId]
                                        )) {
                                            for (
                                                let i = 0;
                                                i < enhancedCards[c.dbId][enhancement];
                                                i++
                                            ) {
                                                existingEnhancements.push(
                                                    <img
                                                        key={`${enhancement}${c.dbId}${i}`}
                                                        className='enhancement clickable'
                                                        src={EnhancementImages[enhancement]}
                                                        onClick={() => {
                                                            let cardEnhancements =
                                                                enhancedCards[c.dbId];

                                                            cardEnhancements[enhancement]--;
                                                            if (cardEnhancements[enhancement] < 0) {
                                                                cardEnhancements[enhancement] = 0;
                                                            }
                                                            enhancedCards[
                                                                c.dbId
                                                            ] = cardEnhancements;

                                                            setEnhanceCards(
                                                                Object.assign({}, enhancedCards)
                                                            );
                                                        }}
                                                    />
                                                );
                                            }
                                        }
                                    }

                                    return (
                                        <tr key={`${c.id}-${c.dbId}`}>
                                            <td
                                                className='pr-2 card-link'
                                                onMouseOver={() => setZoomCard(c)}
                                                onMouseMove={(event) => {
                                                    let y = event.clientY;
                                                    let yPlusHeight = y + 420;

                                                    if (yPlusHeight >= window.innerHeight) {
                                                        y -= yPlusHeight - window.innerHeight;
                                                    }

                                                    setMousePosition({ x: event.clientX, y: y });
                                                }}
                                                onMouseOut={() => setZoomCard(null)}
                                            >
                                                {zoomCard && (
                                                    <div
                                                        className='decklist-card-zoom'
                                                        style={{
                                                            left: mousePos.x + 5 + 'px',
                                                            top: mousePos.y + 'px'
                                                        }}
                                                    >
                                                        <CardImage
                                                            card={Object.assign(
                                                                {},
                                                                zoomCard,
                                                                zoomCard.card,
                                                                zoomCard.cardData
                                                            )}
                                                        />
                                                    </div>
                                                )}
                                                {c.card.locale && c.card.locale[i18n.language]
                                                    ? c.card.locale[i18n.language].name
                                                    : c.card.name}
                                            </td>
                                            <td>
                                                {Object.keys(enhancements).map((enhancement) => {
                                                    let numberAdded =
                                                        usedEnhancements[enhancement] || 0;

                                                    let imgClass = 'enhancement img-noenhance';
                                                    if (numberAdded < enhancements[enhancement]) {
                                                        imgClass += ' clickable';
                                                    }

                                                    return (
                                                        <img
                                                            key={enhancement}
                                                            className={imgClass}
                                                            src={EnhancementImages[enhancement]}
                                                            onClick={() => {
                                                                if (
                                                                    numberAdded >=
                                                                    enhancements[enhancement]
                                                                ) {
                                                                    return;
                                                                }

                                                                let cardEnhancements =
                                                                    enhancedCards[c.dbId] || {};

                                                                cardEnhancements[
                                                                    enhancement
                                                                ] = cardEnhancements[enhancement]
                                                                    ? cardEnhancements[
                                                                          enhancement
                                                                      ] + 1
                                                                    : 1;

                                                                enhancedCards[
                                                                    c.dbId
                                                                ] = cardEnhancements;

                                                                setEnhanceCards(
                                                                    Object.assign({}, enhancedCards)
                                                                );
                                                            }}
                                                        />
                                                    );
                                                })}
                                                {existingEnhancements}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Col>
                    <Col sm='6'>
                        <h4>
                            <Trans>Available Enhancements</Trans>
                        </h4>
                        {enhancementImages}
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center mt-1'>
                        <Button
                            variant='primary'
                            onClick={() => {
                                let cardsWithEnhancements = cards.map((c) => c.id);
                                if (totalUsed < totalEnhancements) {
                                    setErrorMessage(
                                        t(
                                            'You need to assign all enhancements before saving the deck.'
                                        )
                                    );
                                } else if (
                                    Object.values(enhancedCards).length <
                                    cardsWithEnhancements.length
                                ) {
                                    setErrorMessage(
                                        t(
                                            'You need to assign enhancements to all cards that have them.'
                                        )
                                    );
                                } else {
                                    setErrorMessage('');

                                    dispatch(saveDeckEnhancements(selectedDeck, enhancedCards));
                                }
                            }}
                        >
                            <Trans>Save</Trans>
                        </Button>
                    </Col>
                </Row>
            </Panel>
        </Col>
    );
};

export default Enhancements;
