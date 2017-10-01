import React from 'react';
import PropTypes from 'prop-types';
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
            <div className='deck-summary col-xs-12'>
                { this.state.cardToShow ? <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.id + '.jpg' } /> : null }
                <div className='decklist'>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>{ this.props.deck.faction ? <img className='deck-mon img-responsive' src={ '/img/mons/' + this.props.deck.faction.value + '.png' } /> : null }</div>
                    <div className='col-xs-8 col-sm-6'>
                        <div className='info-row row'><span>Clan:</span>{ this.props.deck.faction ? <span className={ 'pull-right' }>{ this.props.deck.faction.name }</span> : null }</div>
                        <div className='info-row row' ref='alliance'><span>Alliance:</span>{ this.props.deck.alliance && this.props.deck.alliance.name ? <span className='pull-right'>{ this.props.deck.alliance.name }</span> : <span> None </span> }</div>
                        <div className='info-row row' ref='provinceCount'><span>Province deck:</span><span className='pull-right'>{ this.props.deck.validation.provinceCount } cards</span></div>
                        <div className='info-row row' ref='dynastyDrawCount'><span>Dynasty Deck:</span><span className='pull-right'>{ this.props.deck.validation.dynastyCount } cards</span></div>
                        <div className='info-row row' ref='conflictDrawCount'><span>Conflict Deck:</span><span className='pull-right'>{ this.props.deck.validation.conflictCount } cards</span></div>
                        <div className='info-row row'><span>Validity:</span>
                            <span className={ this.props.deck.validation.status === 'Valid' ? 'pull-right deck-status valid' : 'pull-right deck-status invalid' }>
                                <StatusPopOver status={ this.props.deck.validation.status } list={ this.props.deck.validation.extendedStatus }
                                    show={ this.props.deck.validation.status !== 'Valid' } />
                            </span>
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
