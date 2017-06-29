import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import $ from 'jquery';

import StatusPopOver from './StatusPopOver.jsx';
import {validateDeck} from './deck-validator';

class DeckSummary extends React.Component {
    constructor() {
        super();

        this.onCardMouseOut = this.onCardMouseOut.bind(this);
        this.onCardMouseOver = this.onCardMouseOver.bind(this);

        this.state = {
            status: '',
            cardToShow: '',
            provinceCount: 0,
            drawCount: 0,
            conflictDrawCount: 0,
            dynastyDrawCount: 0
        };
    }

    componentWillMount() {
        this.updateDeck(validateDeck(this.props));
    }

    componentWillReceiveProps(newProps) {
        this.updateDeck(validateDeck(newProps));
    }

    updateStatus() {
        if(this.state.status === 'Valid') {
            if($(this.refs.popover).popover) {
                $(this.refs.popover).popover('disable');
            }

            return;
        }

        var popoverContent = $($.parseHTML(ReactDOM.findDOMNode(this.refs.popoverContent).outerHTML)).removeClass('hidden').html();
        // XXX Neccessary until I figure out how to make this work for tests
        if($(this.refs.popover).popover) {
            $(this.refs.popover).popover({ trigger: 'hover', html: true });
            $(this.refs.popover).data('bs.popover').options.content = popoverContent;
        }
    }

    updateDeck(status) {
        this.setState({ status: status.status, conflictDrawCount: status.conflictDrawCount, dynastyDrawCount: status.dynastyDrawCount, provinceCount: status.provinceCount, extendedStatus: status.extendedStatus }, this.updateStatus);
    }

    onCardMouseOver(event) {
        var cardToDisplay = _.filter(this.props.cards, card => {
            return event.target.innerText === card.label;
        });

        this.setState({ cardToShow: cardToDisplay[0] });
    }

    onCardMouseOut() {
        this.setState({ cardToShow: undefined });
    }

    getCardsToRender() {
        var cardsToRender = [];
        var groupedCards = {};
        var combinedCards = _.union(this.props.provinceCards, this.props.stronghold, this.props.conflictDrawCards, this.props.dynastyDrawCards);

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
                cards.push(<div key={ card.card.code }><span>{card.count + 'x '}</span><span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.name }</span></div>);
                count += parseInt(card.count);
            });

            cardsToRender.push(<div key={ key } className='card-group'><h4>{ key + ' (' + count.toString() + ')' }</h4>{ cards }</div>);
        });

        return cardsToRender;
    }

    render() {
        var cardsToRender = this.getCardsToRender();

        return (
            <div>
                { this.state.cardToShow ? <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.code + '.png' } /> : null }
                <h3>{ this.props.name }</h3>
                <div className='decklist'>
                    <img className='pull-left' src={ '/img/mons/' + this.props.faction.value + '.png' } />
                     { this.props.allianceFaction && this.props.allianceFaction.value !== 'none' ? <img className='pull-right' src={ '/img/mons/' + this.props.allianceFaction.value + '.png' } /> : null }
                    <div>
                        <h4>{ this.props.faction.name }</h4>
                        <div ref='allianceFaction'>Alliance: { this.props.allianceFaction && this.props.allianceFaction.name ? <span> {this.props.allianceFaction.name} </span> : <span> None </span> } </div>
                   
                        <div ref='provinceCount'>Province deck: { this.state.provinceCount } cards</div>
                        <div ref='dynastyDrawCount'>Dynasty Deck: { this.state.dynastyDrawCount } cards</div>
                        <div ref='conflictDrawCount'>Conflict Deck: { this.state.conflictDrawCount } cards</div>
                                              
                        <div className={this.state.status === 'Valid' ? 'text-success' : 'text-danger'}>
                            <span ref='popover'>{ this.state.status }</span>
                            <StatusPopOver ref='popoverContent' list={this.state.extendedStatus} />
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
    cards: React.PropTypes.array,
    stronghold: React.PropTypes.array,
    conflictDrawCards: React.PropTypes.array,
    dynastyDrawCards: React.PropTypes.array,
    faction: React.PropTypes.shape({
        name: React.PropTypes.string,
        value: React.PropTypes.string
    }).isRequired,
    allianceFaction: React.PropTypes.shape({
        name: React.PropTypes.string,
        value: React.PropTypes.string
    }).isRequired,
    name: React.PropTypes.string,
    provinceCards: React.PropTypes.array
};

export default DeckSummary;
