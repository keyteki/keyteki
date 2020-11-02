const cards = require('./cards');
const Card = require('./Card.js');
const logger = require('../log.js');

class Deck {
    constructor(data) {
        if (!data) {
            return;
        }

        data.cards = data.cards.map((card) => {
            let result = {
                count: card.count,
                card: card.card
            };
            if (!result.card) {
                logger.error(`Corrupt deck ${card.identity} ${card}`);
                return result;
            }

            if (card.maverick) {
                result.card.maverick = card.maverick;
            }
            if (card.anomaly) {
                result.card.anomaly = card.anomaly;
            }

            if (card.house) {
                result.card.house = card.house;
            }

            if (card.image) {
                result.card.cardImage = card.image;
            }

            if (card.enhancements) {
                result.card.enhancements = card.enhancements;
            }

            return result;
        });

        this.data = data;
    }

    prepare(player) {
        let result = {
            houses: [],
            cards: []
        };

        result.houses = this.data.houses;

        this.eachRepeatedCard(this.data.cards, (cardData) => {
            let card = this.createCard(player, cardData);
            if (card) {
                card.setupAbilities();
                card.location = 'deck';
                result.cards.push(card);
            }
        });

        return result;
    }

    eachRepeatedCard(cards, func) {
        for (let cardEntry of Object.values(cards)) {
            func(cardEntry.card);
        }
    }

    createCard(player, cardData) {
        if (!cardData || !cardData.identity) {
            logger.error(`no cardData for ${JSON.stringify(this.data)}`);
            return;
        }

        cardData.image = cardData.cardImage || cardData.uuid.replace(/-/g, '');
        if (cardData.maverick) {
            cardData.house = cardData.maverick;
        } else if (cardData.anomaly) {
            cardData.house = cardData.anomaly;
        }

        if (!cards[cardData.identity]) {
            return new Card(player, cardData);
        }

        let cardClass = cards[cardData.identity];
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
