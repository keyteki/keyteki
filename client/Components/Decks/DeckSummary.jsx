import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { sortBy } from 'underscore';
import { useTranslation } from 'react-i18next';

import { Constants } from '../../constants';
import Archon from './Archon';
import IdentityCard from './IdentityCard';
import CardImage from '../GameBoard/CardImage';

import './DeckSummary.scss';

const DeckSummary = ({ deck }) => {
    const { i18n } = useTranslation();
    let [zoomCard, setZoomCard] = useState(null);
    let [mousePos, setMousePosition] = useState({ x: 0, y: 0 });
    const cardsByHouse = {};

    for (const house of deck.houses) {
        cardsByHouse[house] = [];
        const filteredCards = sortBy(
            deck.cards.filter((c) => c.card.house === house),
            (c) => c.card.name
        );

        for (const card of filteredCards) {
            for (let i = 0; i < card.count; i++) {
                cardsByHouse[house].push(
                    <div
                        key={card.id + i}
                        className='deck-card-link'
                        onMouseOver={() => setZoomCard(card)}
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
                        {card.maverick && (
                            <img className='small-card-icon' src={Constants.MaverickIcon} />
                        )}
                        {card.anomaly && (
                            <img className='small-card-icon' src={Constants.AnomalyIcon} />
                        )}
                    </div>
                );
            }
        }
    }

    return (
        <Col xs='12' className='deck-summary'>
            <div className='decklist'>
                <Row>
                    <Col xs='2' sm='3'>
                        <Archon deck={deck} />
                    </Col>
                    <Col xs='2' sm='3'>
                        <IdentityCard deck={deck} />
                    </Col>
                    <Col xs='8' sm='4'>
                        <Row>
                            <Col xs='7'>
                                <span>Wins</span>
                            </Col>
                            <Col xs='5'>{deck.wins}</Col>
                        </Row>
                        <Row>
                            <Col xs='7'>
                                <span>Losses</span>
                            </Col>
                            <Col xs='5'>{deck.losses}</Col>
                        </Row>
                        <Row>
                            <Col xs='7'>
                                <span>Total</span>
                            </Col>
                            <Col xs='5'>{parseInt(deck.wins) + parseInt(deck.losses)}</Col>
                        </Row>
                        <Row>
                            <Col xs='7'>
                                <span>Win Rate</span>
                            </Col>
                            <Col xs='5'>{deck.winRate}%</Col>
                        </Row>
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
                                    {house[0].toUpperCase() + house.slice(1)}
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
                            <CardImage card={Object.assign({}, zoomCard, zoomCard.cardData)} />
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
            </div>
        </Col>
    );
};

DeckSummary.displayName = 'DeckSummary';

export default DeckSummary;
