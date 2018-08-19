import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import DeckStatus from './DeckStatus.jsx';

class DeckSummary extends React.Component {
    constructor() {
        super();

        this.onCardMouseOut = this.onCardMouseOut.bind(this);
        this.onCardMouseOver = this.onCardMouseOver.bind(this);

        this.state = {
            cardToShow: ''
        };
    }

    onCardMouseOver(event) {
        var cardToDisplay = _.filter(this.props.cards, card => {
            return event.target.innerText === card.name;
        });

        this.setState({ cardToShow: cardToDisplay[0] });
    }

    onCardMouseOut() {
        this.setState({ cardToShow: undefined });
    }

    getCardsToRender() {

        let cardsToRender = [];
        let groupedCards = {};

        //let combinedCards = _.union(this.props.deck.stronghold, this.props.deck.role, this.props.deck.provinceCards, this.props.deck.dynastyCards, this.props.deck.conflictCards);

        _.each(this.props.deck.cards, (card) => {
            let type = card.card.house;

            if(!groupedCards[type]) {
                groupedCards[type] = [card];
            } else {
                groupedCards[type].push(card);
            }
        });

        _.each(groupedCards, (cardList, key) => {
            let cards = [];
            let count = 0;

            _.each(cardList, card => {
                cards.push(<div key={ card.id }><span>{ card.count + 'x ' }</span><span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.name }</span></div>);
                count += parseInt(card.count);
            });

            cardsToRender.push(
                <div className='cards-no-break'>
                    <div className='card-group-title'>{ key + ' (' + count.toString() + ')' }</div>
                    <div key={ key } className='card-group'>{ cards }</div>
                </div>);
        });

        return cardsToRender;
    }

    render() {
        if(!this.props.deck) {
            return <div>Waiting for selected deck...</div>;
        }

        let cardCounts = {
            creature: 0,
            artifact: 0,
            action: 0,
            upgrade: 0
        };

        _.each(this.props.deck.cards, (card) => {
            let type = card.card.type;

            if(_.isNumber(cardCounts[type])) {
                cardCounts[type] += parseInt(card.count);
            }
        });

        var cardsToRender = this.getCardsToRender();

        return (
            <div className='deck-summary col-xs-12'>
                { this.state.cardToShow ? <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.id + '.jpg' } /> : null }
                <div className='decklist'>
                    <div className='col-xs-2 col-sm-3 no-x-padding'><img className='deck-mon img-responsive' src={ '/img/cards/flaregas-spawn-of-conflascoot.jpg' } /></div>
                    <div className='col-xs-8 col-sm-6'>
                        <div className='info-row row'><img className='deck-med-house' src={ '/img/house/' + this.props.deck.houses[0] + '.png' } /><img className='deck-med-house' src={ '/img/house/' + this.props.deck.houses[1] + '.png' } /><img className='deck-med-house' src={ '/img/house/' + this.props.deck.houses[2] + '.png' } /></div>
                        <div className='info-row row' ref='alliance'><span>Actions:</span><span className='pull-right'>{ cardCounts.action } cards</span></div>
                        <div className='info-row row' ref='provinceCount'><span>Artifacts:</span><span className='pull-right'>{ cardCounts.artifact } cards</span></div>
                        <div className='info-row row' ref='dynastyDrawCount'><span>Creatures:</span><span className='pull-right'>{ cardCounts.creature } cards</span></div>
                        <div className='info-row row' ref='conflictDrawCount'><span>Upgrades:</span><span className='pull-right'>{ cardCounts.upgrade } cards</span></div>
                        <div className='info-row row'><span>Validity:</span>
                            <DeckStatus className='pull-right' status={ this.props.deck.status } />
                        </div>
                    </div>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>{ this.props.deck.alliance && this.props.deck.alliance.value !== 'none' ? <img className='deck-alliance-mon img-responsive' src={ '/img/mons/' + this.props.deck.alliance.value + '.png' } /> : null }</div>
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
