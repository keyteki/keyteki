const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const CardDbRootDirectory = path.join(__dirname, '../../fiveringsdb-data');

class DeckBuilder {
    constructor() {
        this.cards = this.loadCards(CardDbRootDirectory);
    }

    loadCards(directory) {
        const cards = {};
        const cardFiles = fs.readdirSync(path.join(directory, 'Card'))
            .filter(file => file.endsWith('.json'));

        _.each(cardFiles, file => {
            let card = require(path.join(directory, 'Card', file));
            if(card.length !== 1) {
                throw new Error('Multiple card versions found');
            }
            cards[card[0].id] = card[0];
        });

        return cards;
    }

    buildDeck(faction, cardLabels) {
        var cardCounts = {};
        _.each(cardLabels, label => {
            var cardData = this.getCard(label);
            if(cardCounts[cardData.id]) {
                cardCounts[cardData.id].count++;
            } else {
                cardCounts[cardData.id] = {
                    count: 1,
                    card: cardData
                };
            }
        });

        return {
            faction: { value: faction },
            conflictCards: _.filter(cardCounts, count => count.card.side === 'conflict'),
            dynastyCards: _.filter(cardCounts, count => count.card.side === 'dynasty'),
            provinceCards: _.filter(cardCounts, count => count.card.type === 'province'),
            stronghold: _.filter(cardCounts, count => count.card.type === 'stronghold')
        };
    }

    getCard(id) {
        if(this.cards[id]) {
            return this.cards[id];
        }

        throw new Error(`Unable to find any card matching ${id}`);
    }
}

module.exports = DeckBuilder;
