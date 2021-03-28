const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const { matchCardByNameAndPack } = require('./cardutil.js');

const PathToSubModulePacks = path.join(__dirname, '../../keyteki-json-data/packs');

const defaultFiller = {
    brobnar: 'anger',
    dis: 'hand-of-dis',
    logos: 'foggify',
    mars: 'ammonia-clouds',
    sanctum: 'champion-anaphiel',
    shadows: 'macis-asp',
    untamed: 'ancient-bear',
    staralliance: 'explo-rover',
    saurian: 'tricerian-legionary'
};
const minDeck = 15;
const fillerHouses = ['untamed', 'sanctum', 'shadows'];

class DeckBuilder {
    constructor() {
        this.cardsByCode = this.loadCards(PathToSubModulePacks);
        this.cards = Object.values(this.cardsByCode);
    }

    loadCards(directory) {
        let cards = {};

        let jsonPacks = fs.readdirSync(directory).filter((file) => file.endsWith('.json'));

        for (let file of jsonPacks) {
            let pack = require(path.join(directory, file));

            for (let card of pack.cards) {
                cards[card.id] = card;
            }
        }

        return cards;
    }

    /*
        options: as player1 and player2 are described in setupTest #1514
    */
    customDeck(player = {}) {
        let deck = [];

        for (let zone of ['deck', 'hand', 'inPlay', 'discard', 'archives']) {
            if (Array.isArray(player[zone])) {
                deck = deck.concat(player[zone]);
            }
        }

        let houses = [];
        for (let label of deck) {
            let card = this.getCard(label);
            if (!houses.includes(card.house.toLowerCase())) {
                houses.push(card.house.toLowerCase());
            }
        }

        let missingHouses = 3 - houses.length;
        if (missingHouses < 0) {
            throw new Error('More than 3 houses present');
        } else if (missingHouses > 0) {
            houses = houses.concat(_.difference(fillerHouses, houses).slice(0, missingHouses));
        }

        while (deck.length < minDeck) {
            deck = deck.concat(defaultFiller[houses[0]]);
        }

        return this.buildDeck(houses, deck);
    }

    buildDeck(houses, cardLabels) {
        var cardCounts = {};
        _.each(cardLabels, (label) => {
            var cardData = this.getCard(label);
            if (cardCounts[cardData.id]) {
                cardCounts[cardData.id].count++;
            } else {
                cardCounts[cardData.id] = {
                    count: 1,
                    card: cardData,
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
        if (this.cards[idOrLabelOrName]) {
            return this.cards[idOrLabelOrName];
        }

        var cardsByName = _.filter(this.cards, matchCardByNameAndPack(idOrLabelOrName));

        if (cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${idOrLabelOrName}`);
        }

        if (cardsByName.length > 1) {
            var matchingLabels = _.map(
                cardsByName,
                (card) => `${card.name} (${card.pack_code})`
            ).join('\n');
            throw new Error(
                `Multiple cards match the name ${idOrLabelOrName}. Use one of these instead:\n${matchingLabels}`
            );
        }

        cardsByName[0].enhancements = null;

        return cardsByName[0];
    }
}

module.exports = DeckBuilder;
