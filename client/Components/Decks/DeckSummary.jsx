import React from 'react';
import PropTypes from 'prop-types';

import DeckStatus from './DeckStatus';
import AltCard from '../GameBoard/AltCard';
import CardImage from '../GameBoard/CardImage';

import { Trans, withTranslation } from 'react-i18next';
import { buildArchon } from '../../archonMaker';

class DeckSummary extends React.Component {
    constructor(props) {
        super(props);

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onCardMouseOver = this.onCardMouseOver.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);

        this.state = {
            cardToShow: '',
            archonShow: false,
            imageUrl: ''
        };
    }

    componentDidMount() {
        buildArchon(this.props.deck, this.props.i18n.language)
            .then(imageUrl => this.setState({ imageUrl }));
    }

    componentDidUpdate(prevProps) {
        if(this.props.i18n.language !== prevProps.i18n.language) {
            buildArchon(this.props.deck, this.props.i18n.language)
                .then(imageUrl => this.setState({ imageUrl }));
        }
    }

    hasTrait(card, trait) {
        return card.traits.some(t => t.toLowerCase() === trait.toLowerCase());
    }

    onCardMouseOver(event) {
        let cardToDisplay = Object.values(this.props.deck.cards).filter(card => {
            let house = event.target.dataset.card_house;
            let cardId = event.target.dataset.card_id;

            return (house === card.card.house) && (cardId === card.card.id);
        });

        this.setState({ cardToShow: cardToDisplay[0] });
    }

    onMouseOver() {
        this.setState({ archonShow: true });
    }

    onMouseOut() {
        this.setState({ cardToShow: false, archonShow: false });
    }

    getCardsToRender() {
        let { i18n, t } = this.props;
        let cardsToRender = [];
        let groupedCards = {};

        for(const card of this.props.deck.cards) {
            let house = card.card.house;
            if(!house) {
                continue;
            }

            if(!groupedCards[house]) {
                groupedCards[house] = [card];
            } else {
                groupedCards[house].push(card);
            }
        }

        // Traverse props.deck.houses to guarantee the card boxes will have the same order as the house icons
        for(const house of this.props.deck.houses) {
            let key = house;
            let houseTitleLocale = t(house);
            let houseTitle = houseTitleLocale[0].toUpperCase() + houseTitleLocale.slice(1);

            let cardList = groupedCards[house];
            let cards = [];
            let count = 0;

            if(cardList) {
                for(const card of cardList) {
                    let cardToRender = (<div key={ card.id }>
                        <span>{ card.count + 'x ' }</span>
                        <span className='card-link' onMouseOver={ this.onCardMouseOver }
                            onMouseOut={ this.onMouseOut }
                            data-card_id={ card.card.id } data-card_house={ house }>
                            { (card.card.locale && card.card.locale[i18n.language]) ? card.card.locale[i18n.language].name : card.card.name }
                        </span>
                        { card.maverick ? <img className='small-maverick' src='/img/maverick.png' width='12px'
                            height='12px'/> : null }
                    </div>);

                    cards.push(cardToRender);
                    count += parseInt(card.count);
                }
            }

            cardsToRender.push(
                <div className='cards-no-break' key={ key }>
                    <div className='card-group-title'>{ houseTitle + ' (' + count.toString() + ')' }</div>
                    <div key={ key } className='card-group'>{ cards }</div>
                </div>);
        }

        return cardsToRender;
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    render() {
        if(!this.props.deck || !this.props.cards) {
            return <div><Trans>Waiting for selected deck...</Trans></div>;
        }

        let cardCounts = {
            creature: 0,
            artifact: 0,
            action: 0,
            upgrade: 0
        };

        for(let card of this.props.deck.cards) {
            let type = card.card.type;

            if(this.isNumeric(cardCounts[type])) {
                cardCounts[type] += parseInt(card.count);
            }
        }

        let cardsToRender = this.getCardsToRender();

        return (
            <div className='deck-summary col-xs-12 no-x-padding'>
                { this.state.cardToShow &&
                    <div className='hover-card'>
                        <CardImage className='hover-image'
                            img={ `/img/cards/${ this.state.cardToShow.card.image }.png` }
                            maverick={ this.state.cardToShow.maverick }
                            anomaly={ this.state.cardToShow.anomaly }
                            amber={ this.state.cardToShow.card.amber }/>
                        <AltCard card={ this.state.cardToShow }/>
                    </div> }
                { this.state.archonShow &&
                    <div className='hover-card'>
                        <div className='hover-image'>
                            <img className={ 'img-responsive' } src={ this.state.imageUrl }/>
                        </div>
                    </div>
                }
                <div className='decklist'>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>
                        <img className={ 'img-responsive' } src={ this.state.imageUrl } onMouseOut={ this.onMouseOut } onMouseOver={ this.onMouseOver }/>
                    </div>
                    <div className='col-xs-8 col-sm-6'>
                        <div className='info-row row'><span><Trans>Actions</Trans>:</span><span
                            className='pull-right'>{ cardCounts.action } <Trans>cards</Trans></span></div>
                        <div className='info-row row'><span><Trans>Artifacts</Trans>:</span><span
                            className='pull-right'>{ cardCounts.artifact } <Trans>cards</Trans></span></div>
                        <div className='info-row row'><span><Trans>Creatures</Trans>:</span><span
                            className='pull-right'>{ cardCounts.creature } <Trans>cards</Trans></span></div>
                        <div className='info-row row'><span><Trans>Upgrades</Trans>:</span><span
                            className='pull-right'>{ cardCounts.upgrade } <Trans>cards</Trans></span></div>
                        { /* <div className='info-row row'><span><Trans>Wins</Trans>:</span><span
                            className='pull-right'>{ this.props.deck.wins }</span></div>
                        <div className='info-row row'><span><Trans>Losses</Trans>:</span><span
                            className='pull-right'>{ this.props.deck.losses }</span></div> */ }
                        <div className='info-row row'><span><Trans>Validity</Trans>:</span>
                            <DeckStatus className='pull-right' status={ this.props.deck.status }/>
                        </div>
                        { this.props.deck.usageLevel > 0 && !this.props.deck.verified ?
                            <div className='info-row row'><Trans i18nKey='decksummary.toverify'>This deck has been
                                flagged as requiring verification. Please email a photo of the decklist with your
                                username written on a piece of paper to</Trans>: thecrucible.deckcheck@gmail.com
                            </div> : null
                        }
                    </div>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>
                        { this.props.deck.agenda && this.props.deck.agenda.code ?
                            <img className='img-responsive' src={ '/img/cards/' + this.props.deck.agenda.code + '.png' }/>
                            : null
                        }
                    </div>
                </div>
                <div className='col-xs-12 no-x-padding'>
                    <div className='cards'>
                        { cardsToRender }
                    </div>
                </div>
            </div>);
    }
}

DeckSummary.displayName = 'DeckSummary';
DeckSummary.propTypes = {
    cards: PropTypes.object,
    deck: PropTypes.object,
    i18n: PropTypes.object,
    t: PropTypes.func
};

export default withTranslation()(DeckSummary);
