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
                            className='card-zoom'
                            style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                        >
                            <CardImage card={zoomCard} />
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

// class DeckSummary extends React.Component {
//     constructor(props) {
//         super(props);

//         this.onMouseOut = this.onMouseOut.bind(this);
//         this.onCardMouseOver = this.onCardMouseOver.bind(this);
//         this.onMouseOver = this.onMouseOver.bind(this);

//         this.state = {
//             cardToShow: '',
//             archonShow: false,
//             imageUrl: ''
//         };
//     }

//     componentDidMount() {
//         buildArchon(this.props.deck, this.props.i18n.language).then((imageUrl) =>
//             this.setState({ imageUrl })
//         );
//     }

//     componentDidUpdate(prevProps) {
//         if (
//             this.props.i18n.language !== prevProps.i18n.language ||
//             this.props.deck !== prevProps.deck
//         ) {
//             buildArchon(this.props.deck, this.props.i18n.language).then((imageUrl) =>
//                 this.setState({ imageUrl })
//             );
//         }
//     }

//     onCardMouseOver(event) {
//         let cardToDisplay = Object.values(this.props.deck.cards).filter((card) => {
//             let house = event.target.dataset.card_house;
//             let cardId = event.target.dataset.card_id;

//             return house === card.card.house && cardId === card.card.id;
//         });

//         this.setState({ cardToShow: cardToDisplay[0] });
//     }

//     onMouseOver() {
//         this.setState({ archonShow: true });
//     }

//     onMouseOut() {
//         this.setState({ cardToShow: false, archonShow: false });
//     }

//     getCardsToRender() {
//         let { i18n, t } = this.props;
//         let cardsToRender = [];
//         let groupedCards = {};

//         for (const card of this.props.deck.cards) {
//             let house = card.card.house;
//             if (!house) {
//                 continue;
//             }

//             if (!groupedCards[house]) {
//                 groupedCards[house] = [card];
//             } else {
//                 groupedCards[house].push(card);
//             }
//         }

//         // Traverse props.deck.houses to guarantee the card boxes will have the same order as the house icons
//         for (const house of this.props.deck.houses) {
//             let key = house;
//             let houseTitleLocale = t(house);
//             let houseTitle = houseTitleLocale[0].toUpperCase() + houseTitleLocale.slice(1);

//             let cardList = groupedCards[house];
//             let cards = [];
//             let count = 0;

//             if (cardList) {
//                 for (const card of cardList) {
//                     let cardToRender = (
//                         <div key={card.id}>
//                             <span>{card.count + 'x '}</span>
//                             <span
//                                 className='card-link'
//                                 onMouseOver={this.onCardMouseOver}
//                                 onMouseOut={this.onMouseOut}
//                                 data-card_id={card.card.id}
//                                 data-card_house={house}
//                             >
//                                 {card.card.locale && card.card.locale[i18n.language]
//                                     ? card.card.locale[i18n.language].name
//                                     : card.card.name}
//                             </span>
//                             {card.maverick ? (
//                                 <img
//                                     className='small-maverick'
//                                     src='/img/maverick.png'
//                                     width='12px'
//                                     height='12px'
//                                 />
//                             ) : null}
//                             {card.anomaly ? (
//                                 <img
//                                     className='small-maverick'
//                                     src='/img/anomaly.png'
//                                     width='12px'
//                                     height='14px'
//                                 />
//                             ) : null}
//                         </div>
//                     );

//                     cards.push(cardToRender);
//                     count += parseInt(card.count);
//                 }
//             }

//             cardsToRender.push(
//                 <div className='cards-no-break' key={key}>
//                     <div className='card-group-title'>
//                         {houseTitle + ' (' + count.toString() + ')'}
//                     </div>
//                     <div key={key} className='card-group'>
//                         {cards}
//                     </div>
//                 </div>
//             );
//         }

//         return cardsToRender;
//     }

//     isNumeric(n) {
//         return !isNaN(parseFloat(n)) && isFinite(n);
//     }

//     render() {
//         if (!this.props.deck || !this.props.cards || this.props.deck.cards.some((c) => !c.card)) {
//             return (
//                 <div>
//                     <Trans>Waiting for selected deck...</Trans>
//                 </div>
//             );
//         }

//         let cardCounts = {
//             creature: 0,
//             artifact: 0,
//             action: 0,
//             upgrade: 0
//         };

//         for (let card of this.props.deck.cards) {
//             let type = card.card.type;

//             if (this.isNumeric(cardCounts[type])) {
//                 cardCounts[type] += parseInt(card.count);
//             }
//         }

//         let cardsToRender = this.getCardsToRender();

//         return (
//             <div className='deck-summary col-xs-12 no-x-padding'>
//                 {this.state.cardToShow && (
//                     <div className='hover-card'>
//                         <CardImage
//                             className='hover-image'
//                             img={`/img/cards/${this.state.cardToShow.card.image}.png`}
//                             maverick={this.state.cardToShow.maverick}
//                             anomaly={this.state.cardToShow.anomaly}
//                             enhancements={this.state.cardToShow.enhancements}
//                             amber={this.state.cardToShow.card.amber}
//                         />
//                         <AltCard card={this.state.cardToShow} />
//                     </div>
//                 )}
//                 {this.state.archonShow && (
//                     <div className='hover-card'>
//                         <div className='hover-image'>
//                             <img className={'img-responsive'} src={this.state.imageUrl} />
//                         </div>
//                     </div>
//                 )}
//                 <div className='decklist'>
//                     <div className='col-xs-2 col-sm-3 no-x-padding'>
//                         <img
//                             className={'img-responsive'}
//                             src={this.state.imageUrl}
//                             onMouseOut={this.onMouseOut}
//                             onMouseOver={this.onMouseOver}
//                         />
//                     </div>
//                     <div className='col-xs-8 col-sm-6'>
//                         <div className='info-row row'>
//                             <span>
//                                 <Trans>Actions</Trans>:
//                             </span>
//                             <span className='pull-right'>
//                                 {cardCounts.action} <Trans>cards</Trans>
//                             </span>
//                         </div>
//                         <div className='info-row row'>
//                             <span>
//                                 <Trans>Artifacts</Trans>:
//                             </span>
//                             <span className='pull-right'>
//                                 {cardCounts.artifact} <Trans>cards</Trans>
//                             </span>
//                         </div>
//                         <div className='info-row row'>
//                             <span>
//                                 <Trans>Creatures</Trans>:
//                             </span>
//                             <span className='pull-right'>
//                                 {cardCounts.creature} <Trans>cards</Trans>
//                             </span>
//                         </div>
//                         <div className='info-row row'>
//                             <span>
//                                 <Trans>Upgrades</Trans>:
//                             </span>
//                             <span className='pull-right'>
//                                 {cardCounts.upgrade} <Trans>cards</Trans>
//                             </span>
//                         </div>
//                         <div className='info-row row'>
//                             <span>
//                                 <Trans>Wins</Trans>:
//                             </span>
//                             <span className='pull-right'>{this.props.deck.wins}</span>
//                         </div>
//                         <div className='info-row row'>
//                             <span>
//                                 <Trans>Losses</Trans>:
//                             </span>
//                             <span className='pull-right'>{this.props.deck.losses}</span>
//                         </div>
//                         <div className='info-row row'>
//                             <span>
//                                 <Trans>Validity</Trans>:
//                             </span>
//                             <DeckStatus className='pull-right' status={this.props.deck.status} />
//                         </div>
//                         {this.props.deck.usageLevel > 0 && !this.props.deck.verified ? (
//                             <div className='info-row row'>
//                                 <Trans i18nKey='decksummary.toverify'>
//                                     This deck is flagged. Please look out for a new verification
//                                     system coming soon.
//                                 </Trans>
//                             </div>
//                         ) : null}
//                     </div>
//                     <div className='col-xs-2 col-sm-3 no-x-padding'>
//                         {this.props.deck.agenda && this.props.deck.agenda.code ? (
//                             <img
//                                 className='img-responsive'
//                                 src={'/img/cards/' + this.props.deck.agenda.code + '.png'}
//                             />
//                         ) : null}
//                     </div>
//                 </div>
//                 <div className='col-xs-12 no-x-padding'>
//                     <div className='cards'>{cardsToRender}</div>
//                 </div>
//             </div>
//         );
//     }
// }
        let imageToShow =
            this.state.cardToShow && this.state.cardToShow.card && this.state.cardToShow.card.image;
        if (imageToShow && imageToShow.includes('https://')) {
            if (this.props.i18n.language !== 'en') {
                imageToShow = imageToShow.replace('/en/', `/${this.props.i18n.language}/`);
                imageToShow = imageToShow.replace('_en', `_${this.props.i18n.language}`);
            }
        } else {
            imageToShow = `/img/cards/${imageToShow}.png`;
        }

        return (
            <div className='deck-summary col-xs-12 no-x-padding'>
                {this.state.cardToShow && (
                    <div className='hover-card'>
                        <CardImage
                            className='hover-image'
                            img={imageToShow}
                            maverick={this.state.cardToShow.maverick}
                            anomaly={this.state.cardToShow.anomaly}
                            enhancements={this.state.cardToShow.enhancements}
                            amber={this.state.cardToShow.card.amber}
                        />
                        <AltCard card={this.state.cardToShow} />
                    </div>
                )}
                {this.state.archonShow && (
                    <div className='hover-card'>
                        <div className='hover-image'>
                            <img className={'img-responsive'} src={this.state.imageUrl} />
                        </div>
                    </div>
                )}
                <div className='decklist'>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>
                        <img
                            className={'img-responsive'}
                            src={this.state.imageUrl}
                            onMouseOut={this.onMouseOut}
                            onMouseOver={this.onMouseOver}
                        />
                    </div>
                    <div className='col-xs-8 col-sm-6'>
                        <div className='info-row row'>
                            <span>
                                <Trans>Actions</Trans>:
                            </span>
                            <span className='pull-right'>
                                {cardCounts.action} <Trans>cards</Trans>
                            </span>
                        </div>
                        <div className='info-row row'>
                            <span>
                                <Trans>Artifacts</Trans>:
                            </span>
                            <span className='pull-right'>
                                {cardCounts.artifact} <Trans>cards</Trans>
                            </span>
                        </div>
                        <div className='info-row row'>
                            <span>
                                <Trans>Creatures</Trans>:
                            </span>
                            <span className='pull-right'>
                                {cardCounts.creature} <Trans>cards</Trans>
                            </span>
                        </div>
                        <div className='info-row row'>
                            <span>
                                <Trans>Upgrades</Trans>:
                            </span>
                            <span className='pull-right'>
                                {cardCounts.upgrade} <Trans>cards</Trans>
                            </span>
                        </div>
                        <div className='info-row row'>
                            <span>
                                <Trans>Wins</Trans>:
                            </span>
                            <span className='pull-right'>{this.props.deck.wins}</span>
                        </div>
                        <div className='info-row row'>
                            <span>
                                <Trans>Losses</Trans>:
                            </span>
                            <span className='pull-right'>{this.props.deck.losses}</span>
                        </div>
                        <div className='info-row row'>
                            <span>
                                <Trans>Validity</Trans>:
                            </span>
                            <DeckStatus className='pull-right' status={this.props.deck.status} />
                        </div>
                        {this.props.deck.usageLevel > 0 && !this.props.deck.verified ? (
                            <div className='info-row row'>
                                <Trans i18nKey='decksummary.toverify'>
                                    This deck is flagged. Please look out for a new verification
                                    system coming soon.
                                </Trans>
                            </div>
                        ) : null}
                    </div>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>
                        {this.props.deck.agenda && this.props.deck.agenda.code ? (
                            <img
                                className='img-responsive'
                                src={'/img/cards/' + this.props.deck.agenda.code + '.png'}
                            />
                        ) : null}
                    </div>
                </div>
                <div className='col-xs-12 no-x-padding'>
                    <div className='cards'>{cardsToRender}</div>
                </div>
            </div>
        );
    }
}

DeckSummary.displayName = 'DeckSummary';

export default DeckSummary;
