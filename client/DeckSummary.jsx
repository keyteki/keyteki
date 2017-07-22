import React from 'react';
import _ from 'underscore';

import StatusPopOver from './StatusPopOver.jsx';

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
        var cardsToRender = [];
        var groupedCards = {};
        var combinedCards = _.union(this.props.deck.provinceCards, this.props.deck.stronghold, this.props.deck.conflictDrawCards, this.props.deck.dynastyDrawCards);

        _.each(combinedCards, (card) => {
            if(!groupedCards[card.card.type]) {
                groupedCards[card.card.type] = [card];
            } else {
                groupedCards[card.card.type].push(card);
            }
        });

        _.each(groupedCards, (cardList, key) => {
            var cards = [];
            var count = 0;

            _.each(cardList, card => {
                cards.push(<div key={ card.card.code }><span>{ card.count + 'x ' }</span><span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.name }</span></div>);
                count += parseInt(card.count);
            });

            cardsToRender.push(<div key={ key } className='card-group'><h4>{ key + ' (' + count.toString() + ')' }</h4>{ cards }</div>);
        });

        return cardsToRender;
    }

    render() {
        if(!this.props.deck) {
            return <div>Waiting for selected deck...</div>;
        }

        var cardsToRender = this.getCardsToRender();

        return (
            <div>
                { this.state.cardToShow ? <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.code + '.png' } /> : null }
                <h3>{ this.props.deck.name }</h3>
                <div className='decklist'>
                    <img className='pull-left' src={ '/img/mons/' + this.props.deck.faction.value + '.png' } />
                     { this.props.deck.allianceFaction && this.props.deck.allianceFaction.value !== 'none' ? <img className='pull-right' src={ '/img/mons/' + this.props.deck.allianceFaction.value + '.png' } /> : null }
                    <div>
                        <h4>{ this.props.deck.faction.name }</h4>
                        <div ref='allianceFaction'>Alliance: { this.props.deck.allianceFaction && this.props.deck.allianceFaction.name ? <span> {this.props.deck.allianceFaction.name} </span> : <span> None </span> } </div>
                   
                        <div ref='provinceCount'>Province deck: { this.props.deck.provinceCount } cards</div>
                        <div ref='dynastyDrawCount'>Dynasty Deck: { this.props.deck.dynastyDrawCount } cards</div>
                        <div ref='conflictDrawCount'>Conflict Deck: { this.props.deck.conflictDrawCount } cards</div>
                                              
                        <div className={ this.props.deck.validation.status === 'Valid' ? 'text-success' : 'text-danger' }>
                            <StatusPopOver status={ this.props.deck.validation.status } list={ this.props.deck.validation.extendedStatus }
                                show={ this.props.deck.validation.status !== 'Valid' } />
                        </div>
                    </div>
                </div>
                <div className='cards'>
                    { cardsToRender }
                </div>
            </div>);
    }
}

DeckSummary.displayName = 'DeckSummary';
DeckSummary.propTypes = {
    cards: React.PropTypes.object,
    deck: React.PropTypes.object
};

export default DeckSummary;
