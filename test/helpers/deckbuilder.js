const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const { matchCardByNameAndPack } = require('./cardutil.js');

const PathToSubModulePacks = path.join(__dirname, '../../keyteki-json-data/packs');

const defaultFiller = {
    brobnar: 'anger',
    dis: 'hand-of-dis',
    ekwidon: 'corner-the-market',
    logos: 'foggify',
    mars: 'ammonia-clouds',
    sanctum: 'champion-anaphiel',
    shadows: 'macis-asp',
    unfathomable: 'hookmaster',
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
                if (player[zone]) {
                    // Token cards are defined as 'token name:card name'
                    deck = deck.concat(
                        player[zone].map((c) => (c.includes(':') ? c.split(':')[1] : c))
                    );
                }
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

        return this.buildDeck(houses, player.token, deck);
    }

    buildDeck(houses, token, cardLabels) {
        let cardCounts = {};
        _.each(cardLabels, (label) => {
            let cardData = this.getCard(label);
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

        if (token) {
            let cardData = this.getCard(token);
            if (cardData.type === 'token creature') {
                cardCounts[cardData.id] = {
                    count: 1,
                    card: cardData,
                    id: cardData.id,
                    isNonDeck: true
                };
            } else {
                throw `Not a token creature: ${cardData.id}`;
            }
        }

        return {
            houses: houses,
            cards: Object.values(cardCounts)
        };
    }

    getCard(idOrLabelOrName) {
        if (this.cards[idOrLabelOrName]) {
            return this.cards[idOrLabelOrName];
        }

        let cardsByName = _.filter(this.cards, matchCardByNameAndPack(idOrLabelOrName));

        if (cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${idOrLabelOrName}`);
        }

        if (cardsByName.length > 1) {
            let matchingLabels = _.map(
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
