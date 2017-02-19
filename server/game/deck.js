const _ = require('underscore');

const cards = require('./cards');
const DrawCard = require('./drawcard.js');
const PlotCard = require('./plotcard.js');
const AgendaCard = require('./agendacard.js');

class Deck {
    constructor(data) {
        this.data = data;
    }

    prepare(player) {
        var result = {
            drawCards: [],
            plotCards: []
        };

        this.eachRepeatedCard(this.data.drawCards, cardData => {
            var drawCard = this.createCard(DrawCard, player, cardData);
            drawCard.location = 'draw deck';
            result.drawCards.push(drawCard);
        });

        this.eachRepeatedCard(this.data.plotCards, cardData => {
            var plotCard = this.createCard(PlotCard, player, cardData);
            plotCard.location = 'plot deck';
            result.plotCards.push(plotCard);
        });

        if(this.data.faction) {
            result.faction = new DrawCard(player, _.extend({
                code: this.data.faction.value,
                type_code: 'faction',
                faction_code: this.data.faction.value
            }, this.data.faction));
        } else {
            result.faction = new DrawCard(player, { type_code: 'faction' });
        }
        result.faction.moveTo('faction');

        result.allCards = [result.faction].concat(result.drawCards).concat(result.plotCards);

        if(this.data.agenda) {
            result.agenda = this.createCard(AgendaCard, player, this.data.agenda);
            result.agenda.moveTo('agenda');
            result.allCards.push(result.agenda);
        } else {
            result.agenda = undefined;
        }

        return result;
    }

    eachRepeatedCard(cards, func) {
        _.each(cards, cardEntry => {
            for(var i = 0; i < cardEntry.count; i++) {
                func(cardEntry.card);
            }
        });
    }

    createCard(baseClass, player, cardData) {
        var cardClass = cards[cardData.code] || baseClass;
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
