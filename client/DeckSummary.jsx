import React from 'react';
import _ from 'underscore';
import {validateDeck} from './deck-validator';

class DeckSummary extends React.Component {
    constructor() {
        super();

        this.onCardMouseOut = this.onCardMouseOut.bind(this);
        this.onCardMouseOver = this.onCardMouseOver.bind(this);

        this.state = {
            status: '',
            cardToShow: '',
            plotCount: 0,
            drawCount: 0
        };
    }

    componentWillMount() {
        this.updateDeck(validateDeck(this.props));
    }

    componentWillReceiveProps(newProps) {
        this.updateDeck(validateDeck(newProps));
    }

    updateDeck(status) {
        this.setState({ status: status.status, drawCount: status.drawCount, plotCount: status.plotCount });
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
        var combinedCards = _.union(this.props.plotCards, this.props.drawCards);

        _.each(combinedCards, (card) => {
            if(!groupedCards[card.card.type_name]) {
                groupedCards[card.card.type_name] = [card];
            } else {
                groupedCards[card.card.type_name].push(card);
            }
        });

        _.each(groupedCards, (cardList, key) => {
            var cards = [];
            var count = 0;

            _.each(cardList, card => {
                cards.push(<div key={ card.card.code }><span>{card.count + 'x '}</span><span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.label }</span></div>);
                count += parseInt(card.count);
            });

            cardsToRender.push(<div key={ key } className='card-group'><h4>{ key + ' (' + count.toString() + ')' }</h4>{ cards }</div>);
        });

        return cardsToRender;
    }

    render() {
        var cardsToRender = this.getCardsToRender();

        return (
            <div className={ this.props.className }>
                { this.state.cardToShow ? <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.code + '.png' } /> : null }
                <h3>{ this.props.name }</h3>
                <div className='decklist'>
                    <img className='pull-left' src={ '/img/factions/' + this.props.faction.value + '.png' } />
                    { this.props.agenda && this.props.agenda.code ? <img className='pull-right' src={ '/img/cards/' + this.props.agenda.code + '.png' } /> : null }
                    <div>
                        <h4>{ this.props.faction.name }</h4>
                        <div ref='agenda'>Agenda: { this.props.agenda && this.props.agenda.label ? <span className='card-link' onMouseOver={ this.onCardMouseOver }
                            onMouseOut={ this.onCardMouseOut }>{ this.props.agenda.label }</span> : <span>None</span> }</div>
                        <div ref='drawCount'>Draw deck: { this.state.drawCount } cards</div>
                        <div ref='plotCount'>Plot deck: { this.state.plotCount } cards</div>
                        <div className={this.state.status === 'Valid' ? 'text-success' : 'text-danger'}>{ this.state.status }</div>
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
    agenda: React.PropTypes.shape({
        code: React.PropTypes.string,
        label: React.PropTypes.string
    }),
    cards: React.PropTypes.array,
    className: React.PropTypes.string,
    drawCards: React.PropTypes.array,
    faction: React.PropTypes.shape({
        name: React.PropTypes.string,
        value: React.PropTypes.string
    }).isRequired,
    name: React.PropTypes.string,
    plotCards: React.PropTypes.array
};

export default DeckSummary;
