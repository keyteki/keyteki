const _ = require('underscore');

const cards = require('./cards');
const DrawCard = require('./drawcard.js');
const ProvinceCard = require('./provincecard.js');
const StrongholdCard = require('./strongholdcard.js');

class Deck {
    constructor(data) {
        this.data = data;
    }

    prepare(player) {
        var result = {
            allCards: [],
            allPlayableCards: [],
            faction: {},
            conflictDrawCards: [],
            dynastyDrawCards: [],
            provinceCards: [],
            stronghold: []
        };

        //faction
        result.faction = this.data.faction;

        //conflict
        this.eachRepeatedCard(this.data.conflictDrawCards, cardData => {
            if(['conflict'].includes(cardData.deck)) {
                var drawCard = this.createCard(DrawCard, player, cardData);
                drawCard.location = 'conflict deck';
                result.conflictDrawCards.push(drawCard);
            }
        });

        //dynasty
        this.eachRepeatedCard(this.data.dynastyDrawCards, cardData => {
            if(['dynasty'].includes(cardData.deck)) {
                var drawCard = this.createCard(DrawCard, player, cardData);
                drawCard.location = 'dynasty deck';
                result.dynastyDrawCards.push(drawCard);
            }
        });

        this.eachRepeatedCard(this.data.provinceCards, cardData => {
            if(cardData.type_code === 'province') {
                var provinceCard = this.createCard(ProvinceCard, player, cardData);
                provinceCard.location = 'province deck';
                result.provinceCards.push(provinceCard);
            }
        });

        this.eachRepeatedCard(this.data.stronghold, cardData => {
            if(cardData.type_code === 'stronghold') {
                var strongholdCard = this.createCard(StrongholdCard, player, cardData);
                strongholdCard.location = 'stronghold province';
                result.stronghold.push(strongholdCard);
            }
        });

        result.allCards = [result.stronghold].concat(result.provinceCards).concat(result.conflictDrawCards).concat(result.dynastyDrawCards);
        result.allPlayableCards = [result.conflictDrawCards].concat(result.dynastyDrawCards);

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
