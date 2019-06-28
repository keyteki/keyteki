import React from 'react';
import PropTypes from 'prop-types';

import DeckStatus from './DeckStatus';
import AltCard from '../GameBoard/AltCard';

class DeckSummary extends React.Component {
    constructor() {
        super();

        this.onCardMouseOut = this.onCardMouseOut.bind(this);
        this.onCardMouseOver = this.onCardMouseOver.bind(this);

        this.state = {
            cardToShow: ''
        };
    }

    hasTrait(card, trait) {
        return card.traits.some(t => t.toLowerCase() === trait.toLowerCase());
    }

    onCardMouseOver(event) {
        let cardToDisplay = Object.values(this.props.deck.cards).filter(card => {
            return event.target.innerText === card.card.name;
        });

        this.setState({ cardToShow: cardToDisplay[0] });
    }

    onCardMouseOut() {
        this.setState({ cardToShow: undefined });
    }

    getCardsToRender() {
        let cardsToRender = [];
        let groupedCards = {};

        for(const card of this.props.deck.cards) {
            let houseCode = card.card.house;
            if(!houseCode) {
                continue;
            }

            let house = houseCode[0].toUpperCase() + houseCode.slice(1);

            if(!groupedCards[house]) {
                groupedCards[house] = [card];
            } else {
                groupedCards[house].push(card);
            }
        }

        for(const [key, cardList] of Object.entries(groupedCards)) {
            let cards = [];
            let count = 0;

            for(const card of cardList) {
                cards.push(<div key={ card.id }><span>{ card.count + 'x ' }</span><span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.name }</span></div>);
                count += parseInt(card.count);
            }

            cardsToRender.push(
                <div className='cards-no-break' key={ key }>
                    <div className='card-group-title'>{ key + ' (' + count.toString() + ')' }</div>
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
            return <div>Waiting for selected deck...</div>;
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
                { this.state.cardToShow ?
                    <div className='hover-card'>
                        <img className='hover-image' src={ `/img/cards/${this.state.cardToShow.card.image}.png` } />
                        <AltCard card={ this.state.cardToShow } />
                    </div> : null }
                <div className='decklist'>
                    <div className='col-xs-2 col-sm-3 no-x-padding'><img className='img-responsive' src={ '/img/idbacks/identity.jpg' } /></div>
                    <div className='col-xs-8 col-sm-6'>
                        <div className='info-row row'><img className='deck-med-house' src={ '/img/house/' + this.props.deck.houses[0] + '.png' } /><img className='deck-med-house' src={ '/img/house/' + this.props.deck.houses[1] + '.png' } /><img className='deck-med-house' src={ '/img/house/' + this.props.deck.houses[2] + '.png' } /></div>
                        <div className='info-row row'><span>Actions:</span><span className='pull-right'>{ cardCounts.action } cards</span></div>
                        <div className='info-row row'><span>Artifacts:</span><span className='pull-right'>{ cardCounts.artifact } cards</span></div>
                        <div className='info-row row'><span>Creatures:</span><span className='pull-right'>{ cardCounts.creature } cards</span></div>
                        <div className='info-row row'><span>Upgrades:</span><span className='pull-right'>{ cardCounts.upgrade } cards</span></div>
                        <div className='info-row row'><span>Validity:</span>
                            <DeckStatus className='pull-right' status={ this.props.deck.status } />
                        </div>
                        { this.props.deck.flagged && !this.props.deck.verified ?
                            <div className='info-row row'>This deck has been flagged as requiring verification. Please email a photo of the decklist with your username written on a piece of paper to: thecrucible.deckcheck@gmail.com
                            </div> : null
                        }
                    </div>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>{ this.props.deck.agenda && this.props.deck.agenda.code ? <img className='img-responsive' src={ '/img/cards/' + this.props.deck.agenda.code + '.png' } /> : null }</div>
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
    deck: PropTypes.object
};

export default DeckSummary;
