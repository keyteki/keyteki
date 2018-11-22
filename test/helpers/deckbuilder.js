const path = require('path');
const _ = require('underscore');

const {matchCardByNameAndPack} = require('./cardutil.js');

const pathToJson = path.join(__dirname, '../../server/scripts/keyforge.json');

const defaultFiller = {
    brobnar: 'anger',
    dis: 'hand-of-dis',
    logos: 'foggify',
    mars: 'ammonia-clouds',
    sanctum: 'champion-anaphiel',
    shadows: 'macis-asp',
    untamed: 'ancient-bear'
};
const minDeck = 15;
const fillerHouses = ['untamed', 'sanctum', 'shadows'];

class DeckBuilder {
    constructor() {
        this.cards = this.loadCards(pathToJson);
    }

    loadCards(pathToJson) {
        let cards = {};
        let jsonCards = require(pathToJson);

        _.each(jsonCards.CardData, card => {
            let id = card.name.toLowerCase().replace(/[".!]/gi, '').replace(/[ ']/gi, '-');
            cards[id] = Object.assign({ id: id }, card);
        });

        return cards;
    }

    /*
        options: as player1 and player2 are described in setupTest #1514
    */
    customDeck(player = {}) {
        let deck = [];

        for(let zone of ['deck', 'hand', 'inPlay', 'discard', 'archives']) {
            if(Array.isArray(player[zone])) {
                deck = deck.concat(player[zone]);
            }
        }

        let houses = [];
        for(let label of deck) {
            let card = this.getCard(label);
            if(!houses.includes(card.house.toLowerCase())) {
                houses.push(card.house.toLowerCase());
            }
        }

        let missingHouses = 3 - houses.length;
        if(missingHouses < 0) {
            throw new Error('More than 3 houses present');
        } else if(missingHouses > 0) {
            houses = houses.concat(_.difference(fillerHouses, houses).slice(0, missingHouses));
        }

        while(deck.length < minDeck) {
            deck = deck.concat(defaultFiller[houses[0]]);
        }

        return this.buildDeck(houses, deck);
    }

    buildDeck(houses, cardLabels) {
        var cardCounts = {};
        _.each(cardLabels, label => {
            var cardData = this.getCard(label);
            if(cardCounts[cardData.id]) {
                cardCounts[cardData.id].count++;
            } else {
                cardCounts[cardData.id] = {
                    count: 1,
                    id: cardData.id
                };
            }
        });

        return {
            houses: houses,
            cards: Object.values(cardCounts)
        };
    }

    getCard(idOrLabelOrName) {
        if(this.cards[idOrLabelOrName]) {
            return this.cards[idOrLabelOrName];
        }

        var cardsByName = _.filter(this.cards, matchCardByNameAndPack(idOrLabelOrName));

        if(cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${idOrLabelOrName}`);
        }

        if(cardsByName.length > 1) {
            var matchingLabels = _.map(cardsByName, card => `${card.name} (${card.pack_code})`).join('\n');
            throw new Error(`Multiple cards match the name ${idOrLabelOrName}. Use one of these instead:\n${matchingLabels}`);
        }

        return cardsByName[0];
    }
}

module.exports = DeckBuilder;
