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
        let cardsToRender = [];
        let groupedCards = {};

        let combinedCards = _.union(this.props.deck.stronghold, this.props.deck.role, this.props.deck.provinceCards, this.props.deck.dynastyCards, this.props.deck.conflictCards);

        _.each(combinedCards, (card) => {
            let type = card.card.type;

            if(type === 'character') {
                type = card.card.side + ' character';
            }
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
                cards.push(<div key={ card.card.id }><span>{ card.count + 'x ' }</span><span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.name }</span></div>);
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

        var cardsToRender = this.getCardsToRender();

        return (
            <div>
                { this.state.cardToShow ? <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.id + '.jpg' } /> : null }
                <h3>{ this.props.deck.name }</h3>
                <div className='decklist'>
                    <img className='deck-mon pull-left' src={ '/img/mons/' + this.props.deck.faction.value + '.png' } />
                    { this.props.deck.alliance && this.props.deck.alliance.value !== 'none' ? <img className='deck-alliance-mon pull-right' src={ '/img/mons/' + this.props.deck.alliance.value + '.png' } /> : null }
                    <div>
                        <h4>{ this.props.deck.faction.name }</h4>
                        <div ref='alliance'>Alliance: { this.props.deck.alliance && this.props.deck.alliance.name ? <span> { this.props.deck.alliance.name } </span> : <span> None </span> } </div>
                   
                        <div ref='provinceCount'>Province deck: { this.props.deck.validation.provinceCount } cards</div>
                        <div ref='dynastyDrawCount'>Dynasty Deck: { this.props.deck.validation.dynastyCount } cards</div>
                        <div ref='conflictDrawCount'>Conflict Deck: { this.props.deck.validation.conflictCount } cards</div>
                                              
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
