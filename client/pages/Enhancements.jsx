import React, { useState } from 'react';
import { Col, Button, Row } from 'react-bootstrap';
import Panel from '../Components/Site/Panel';
import { useTranslation, Trans } from 'react-i18next';
import AlertPanel from '../Components/Site/AlertPanel';
import { useSelector, useDispatch } from 'react-redux';

import AmberImage from '../assets/img/enhancements/amberui.png';
import CaptureImage from '../assets/img/enhancements/captureui.png';
import DrawImage from '../assets/img/enhancements/drawui.png';
import DamageImage from '../assets/img/enhancements/damageui.png';
import { navigate, saveDeckEnhancements, clearApiStatus } from '../redux/actions';

import './Enhancements.scss';
import { Decks } from '../redux/types';
import ApiStatus from '../Components/Site/ApiStatus';

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
    const { t } = useTranslation();
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

    let cards = selectedDeck.cards.filter((c) => c.enhancements);

    return (
        <Col md={{ span: 8, offset: 2 }} className='profile full-height'>
            <Panel title={`${t('Assign Enhancements')} - ${selectedDeck.name}`}>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Decks.SaveEnhancements))}
                />
                <AlertPanel>
                    <Trans>
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
                        {cards.map((c) => {
                            let existingEnhancements = [];
                            let index = 0;

                            if (enhancedCards[c.dbId]) {
                                for (const enhancement of Object.keys(enhancedCards[c.dbId])) {
                                    for (let i = 0; i < enhancedCards[c.dbId][enhancement]; i++) {
                                        existingEnhancements.push(
                                            <img
                                                key={`${enhancement}${index++}`}
                                                className='enhancement clickable'
                                                src={EnhancementImages[enhancement]}
                                                onClick={() => {
                                                    let cardEnhancements = enhancedCards[c.dbId];

                                                    cardEnhancements[enhancement]--;
                                                    enhancedCards[c.dbId] = cardEnhancements;

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
                                <div key={c.id}>
                                    <span className='pr-2'>{c.card.name}</span>
                                    {existingEnhancements}
                                    {Object.keys(enhancements).map((enhancement) => {
                                        let numberAdded = usedEnhancements[enhancement] || 0;

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
                                                    if (numberAdded >= enhancements[enhancement]) {
                                                        return;
                                                    }

                                                    let cardEnhancements =
                                                        enhancedCards[c.dbId] || {};

                                                    cardEnhancements[
                                                        enhancement
                                                    ] = cardEnhancements[enhancement]
                                                        ? cardEnhancements[enhancement] + 1
                                                        : 1;

                                                    enhancedCards[c.dbId] = cardEnhancements;

                                                    setEnhanceCards(
                                                        Object.assign({}, enhancedCards)
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
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
