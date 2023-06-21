import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { sortBy } from 'underscore';
import { useTranslation, Trans } from 'react-i18next';

import { Constants } from '../../constants';
import CardBack from './CardBack';
import CardImage from '../GameBoard/CardImage';

import AmberImage from '../../assets/img/enhancements/amberui.png';
import CaptureImage from '../../assets/img/enhancements/captureui.png';
import DrawImage from '../../assets/img/enhancements/drawui.png';
import DamageImage from '../../assets/img/enhancements/damageui.png';

import './DeckSummary.scss';

const DeckSummary = ({ deck }) => {
    const { t, i18n } = useTranslation();
    let [zoomCard, setZoomCard] = useState(null);
    let [mousePos, setMousePosition] = useState({ x: 0, y: 0 });
    const cardsByHouse = {};
    const enhancements = {};

    for (const house of deck.houses.sort()) {
        cardsByHouse[house] = [];
        const filteredCards = sortBy(
            deck.cards.filter((c) => c.card.house === house && !c.isNonDeck),
            (c) => c.card.name
        );

        for (const card of filteredCards) {
            for (let i = 0; i < card.count; i++) {
                let cardClass = 'deck-card-link';

                if (card.card.enhancements) {
                    cardClass += ' enhanced-card';
                    for (const e of card.card.enhancements) {
                        enhancements[e] = 1 + (enhancements[e] || 0);
                    }
                }

                cardsByHouse[house].push(
                    <div
                        key={`${card.dbId}${i}`}
                        className={cardClass}
                        onMouseOver={() => setZoomCard(card.card)}
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
                        {card.card.locale && card.card.locale[i18n.language]
                            ? card.card.locale[i18n.language].name
                            : card.card.name}
                        {card.card.maverick && (
                            <img className='small-card-icon' src={Constants.MaverickIcon} />
                        )}
                        {card.card.anomaly && (
                            <img className='small-card-icon' src={Constants.AnomalyIcon} />
                        )}
                    </div>
                );
            }
        }
    }

    let nonDeckCards = deck.cards
        .filter((c) => c.isNonDeck)
        .map((card, i) => {
            return (
                <div
                    key={`${card.dbId}${i}`}
                    className='deck-card-link'
                    onMouseOver={() => setZoomCard(card.card)}
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
                    {card.card.locale && card.card.locale[i18n.language]
                        ? card.card.locale[i18n.language].name
                        : card.card.name}
                    {card.card.maverick && (
                        <img className='small-card-icon' src={Constants.MaverickIcon} />
                    )}
                    {card.card.anomaly && (
                        <img className='small-card-icon' src={Constants.AnomalyIcon} />
                    )}
                </div>
            );
        });

    return (
        <Col xs='12' className='deck-summary'>
            <Row>
                <Col xs='2' sm='3'>
                    <CardBack deck={deck} size={'x-large'} />
                </Col>
                <Col xs='8' sm='5'>
                    <Row>
                        <Col xs='7'>
                            <span>{t('Wins')}</span>
                        </Col>
                        <Col xs='5'>{deck.wins}</Col>
                    </Row>
                    <Row>
                        <Col xs='7'>
                            <span>{t('Losses')}</span>
                        </Col>
                        <Col xs='5'>{deck.losses}</Col>
                    </Row>
                    <Row>
                        <Col xs='7'>
                            <span>{t('Total')}</span>
                        </Col>
                        <Col xs='5'>{parseInt(deck.wins) + parseInt(deck.losses)}</Col>
                    </Row>
                    <Row>
                        <Col xs='7'>
                            <span>{t('Win Rate')}</span>
                        </Col>
                        <Col xs='5'>{deck.winRate?.toFixed(2)}%</Col>
                    </Row>
                    {Object.keys(enhancements).length > 0 ? (
                        <Row className='deck-enhancements'>
                            <Col xs='3' className='deck-enhancement'>
                                <img src={AmberImage} className='deck-img-enhancement' />
                                <span className='deck-text-enhancement'>
                                    {enhancements.amber || 0}
                                </span>
                            </Col>
                            <Col xs='3' className='deck-enhancement'>
                                <img src={CaptureImage} className='deck-img-enhancement' />
                                <span className='deck-text-enhancement'>
                                    {enhancements.capture || 0}
                                </span>
                            </Col>
                            <Col xs='3' className='deck-enhancement'>
                                <img src={DrawImage} className='deck-img-enhancement' />
                                <span className='deck-text-enhancement'>
                                    {enhancements.draw || 0}
                                </span>
                            </Col>
                            <Col xs='3' className='deck-enhancement'>
                                <img src={DamageImage} className='deck-img-enhancement' />
                                <span className='deck-text-enhancement'>
                                    {enhancements.damage || 0}
                                </span>
                            </Col>
                        </Row>
                    ) : null}
                </Col>
            </Row>
            <Row className='deck-houses'>
                {deck.houses.map((house) => {
                    return (
                        <Col key={house} sm='4'>
                            <img
                                className='deck-house-image img-fluid'
                                src={Constants.HouseIconPaths[house]}
                            />
                            <span className='deck-house'>
                                {t(house)[0].toUpperCase() + t(house).slice(1)}
                            </span>
                        </Col>
                    );
                })}
            </Row>
            <Row className='deck-cards'>
                {zoomCard && (
                    <div
                        className='decklist-card-zoom'
                        style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                    >
                        <CardImage card={Object.assign({}, zoomCard)} />
                    </div>
                )}
                {deck.houses.map((house) => {
                    return (
                        <Col key={house} sm='4'>
                            {cardsByHouse[house]}
                        </Col>
                    );
                })}
            </Row>

            <Row className='deck-houses'>
                <Col xs='12'>
                    <Trans>Non-Deck Cards</Trans>
                </Col>
            </Row>
            <Row className='deck-cards'>
                <Col sm='4'>{nonDeckCards}</Col>
            </Row>
        </Col>
    );
};

DeckSummary.displayName = 'DeckSummary';

export default DeckSummary;
