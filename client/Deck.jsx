import React from 'react';
import _ from 'underscore';

class Deck extends React.Component {
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
        this.validateDeck(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.validateDeck(newProps);
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

    hasTrait(card, trait) {
        var traits = card.card.traits;
        var split = traits.split('.');

        return _.any(split, function(t) {
            return t.toLowerCase() === trait.toLowerCase();
        });
    }

    isBannerCard(bannerCode, faction) {
        switch(bannerCode) {
            // Banner of the stag
            case '01198':
                return faction === 'baratheon';
            // Banner of the kraken
            case '01199':
                return faction === 'greyjoy';
            // Banner of the lion
            case '01200':
                return faction === 'lannister';
            // Banner of the sun
            case '01201':
                return faction === 'martell';
            // Banner of the watch
            case '01202':
                return faction === 'thenightswatch';
            // Banner of the wolf
            case '01203':
                return faction === 'stark';
            // Banner of the dragon
            case '01204':
                return faction === 'targaryen';
            // Banner of the rose
            case '01205':
                return faction === 'tyrell';
        }

        return false;
    }

    validateDeck(props) {
        var plotCount = this.getDeckCount(props.plotCards);
        var drawCount = this.getDeckCount(props.drawCards);
        var status = 'Valid';

        if(drawCount < 60) {
            status = 'Too few draw cards';
        }

        if(plotCount < 7) {
            status = 'Too few plot cards';
        }

        var combined = _.union(props.plotCards, props.drawCards);

        if(_.any(combined, function(card) {
            return card.count > card.card.deck_limit;
        })) {
            status = 'Invalid';
        }

        if(plotCount > 7) {
            status = 'Invalid';
        }

        // Kings of summer        
        if(props.agenda && props.agenda.code === '04037' && _.any(props.plotCards, card => {
            return this.hasTrait(card, 'winter');
        })) {
            status = 'Invalid';
        }

        // Kings of winter        
        if(props.agenda && props.agenda.code === '04038' && _.any(props.plotCards, card => {
            return this.hasTrait(card, 'summer');
        })) {
            status = 'Invalid';
        }

        var bannerCount = 0;

        if(!_.all(combined, card => {
            var faction = card.card.faction_code.toLowerCase();
            var bannerCard = false;

            if(props.agenda && this.isBannerCard(props.agenda.code, faction) && !card.card.is_loyal) {
                bannerCount += card.count;
                bannerCard = true;
            }

            return bannerCard || faction === props.faction.value.toLowerCase() || faction === 'neutral';
        })) {
            status = 'Invalid';
        }

        if(bannerCount > 0 && bannerCount < 12) {
            status = 'Invalid';
        }

        this.setState({ status: status, plotCount: plotCount, drawCount: drawCount });
    }

    getDeckCount(deck) {
        var count = 0;

        _.each(deck, function(card) {
            count += card.count;
        });

        return count;
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
                cards.push(<div key={ card.card.code }><span>{card.count + 'x '}</span><span className='card-name' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.label }</span></div>);
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
                        <div ref='agenda'>Agenda: { this.props.agenda && this.props.agenda.label ? <span className='card-name' onMouseOver={ this.onCardMouseOver }
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

Deck.displayName = 'Deck';
Deck.propTypes = {
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

export default Deck;
