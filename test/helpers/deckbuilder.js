const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const {matchCardByNameAndPack} = require('./cardutil.js');

const PathToSubModulePacks = path.join(__dirname,  '../../fiveringsdb-data');

class DeckBuilder {
    constructor() {
        this.cards = this.loadCards(PathToSubModulePacks);
    }

    loadCards(directory) {
        var cards = {};

        var jsonPacks = fs.readdirSync(directory).filter(file => file.endsWith('.json'));

        _.each(jsonPacks, file => {
            var cardsInPack = require(path.join(PathToSubModulePacks, file));

            _.each(cardsInPack, card => {
                cards[card.code] = card;
            });
        });

        return cards;
    }

    buildDeck(faction, cardLabels) {
        var cardCounts = {};
        _.each(cardLabels, label => {
            var cardData = this.getCard(label);
            if(cardCounts[cardData.code]) {
                cardCounts[cardData.code].count++;
            } else {
                cardCounts[cardData.code] = {
                    count: 1,
                    card: cardData
                };
            }
        });

        return {
            faction: { value: faction },
            stronghold: _.filter(cardCounts, count => count.card.type === 'stronghold'),
            role: _.filter(cardCounts, count => count.card.type === 'role'),
            conflictCards: _.filter(cardCounts, count => count.card.side === 'conflict'),
            dynastyCards: _.filter(cardCounts, count => count.card.side === 'dynasty'),
            provinceCards: _.filter(cardCounts, count => count.card.type === 'province')
        };
    }

    getCard(codeOrLabelOrName) {
        if(this.cards[codeOrLabelOrName]) {
            return this.cards[codeOrLabelOrName];
        }

        var cardsByName = _.filter(this.cards, matchCardByNameAndPack(codeOrLabelOrName));

        if(cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${codeOrLabelOrName}`);
        }

        if(cardsByName.length > 1) {
            var matchingLabels = _.map(cardsByName, card => `${card.name} (${card.pack_code})`).join('\n');
            throw new Error(`Multiple cards match the name ${codeOrLabelOrName}. Use one of these instead:\n${matchingLabels}`);
        }

        return cardsByName[0];
    }
}

module.exports = DeckBuilder;
