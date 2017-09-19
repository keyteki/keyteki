const _ = require('underscore');

const cards = require('./cards');
const DrawCard = require('./drawcard.js');
const ProvinceCard = require('./provincecard.js');
const StrongholdCard = require('./strongholdcard.js');
const RoleCard = require('./rolecard.js');

class Deck {
    constructor(data) {
        this.data = data;
    }

    prepare(player) {
        var result = {
            faction: {},
            conflictCards: [],
            dynastyCards: [],
            provinceCards: [],
            stronghold: undefined,
            role: undefined
        };

        //faction
        result.faction = this.data.faction;

        //conflict
        this.eachRepeatedCard(this.data.conflictCards, cardData => {
            if(['conflict'].includes(cardData.side)) {
                var conflictCard = this.createCard(DrawCard, player, cardData);
                conflictCard.location = 'conflict deck';
                result.conflictCards.push(conflictCard);
            }
        });

        //dynasty
        this.eachRepeatedCard(this.data.dynastyCards, cardData => {
            if(['dynasty'].includes(cardData.side)) {
                var dynastyCard = this.createCard(DrawCard, player, cardData);
                dynastyCard.location = 'dynasty deck';
                result.dynastyCards.push(dynastyCard);
            }
        });

        this.eachRepeatedCard(this.data.provinceCards, cardData => {
            if(cardData.type === 'province') {
                var provinceCard = this.createCard(ProvinceCard, player, cardData);
                provinceCard.location = 'province deck';
                result.provinceCards.push(provinceCard);
            }
        });

        this.eachRepeatedCard(this.data.stronghold, cardData => {
            if(cardData.type === 'stronghold') {
                var strongholdCard = this.createCard(StrongholdCard, player, cardData);
                strongholdCard.location = 'stronghold province';
                result.stronghold = strongholdCard;
            }
        });

        this.eachRepeatedCard(this.data.role, cardData => {
            if(cardData.type === 'role') {
                var roleCard = this.createCard(RoleCard, player, cardData);
                result.role = roleCard;
            }
        });

        result.allCards = result.provinceCards.concat(result.conflictCards).concat(result.dynastyCards);

        if(result.stronghold) {
            result.allCards.push(result.stronghold);
        }

        if(result.role) {
            result.allCards.push(result.role);
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
        var cardClass = cards[cardData.id] || baseClass;
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
