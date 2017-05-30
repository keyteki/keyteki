const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const {matchCardByNameAndPack} = require('./cardutil.js');

const PathToSubModulePacks = path.join(__dirname, '../../card-json/pack');

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
            drawCards: _.filter(cardCounts, cardCount => ['character', 'holding', 'attachment', 'event'].includes(cardCount.card.type_code)),
            provinceCards: _.filter(cardCounts, cardCount => cardCount.card.type_code === 'province')
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
