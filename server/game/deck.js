const _ = require('underscore');

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
                logger.error(`Corrupt deck ${card.id} ${card}`);
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

            result.card.isNonDeck = card.isNonDeck;

            return result;
        });

        this.data = data;
    }

    prepare(player) {
        const result = {
            houses: [],
            cards: []
        };

        result.houses = this.data.houses;

        this.eachRepeatedCard(
            this.data.cards.filter((c) => !c.card.isNonDeck),
            (cardData) => {
                let card = this.createCard(player, cardData);
                if (card) {
                    card.setupAbilities();
                    card.location = 'deck';
                    result.cards.push(card);
                }
            }
        );

        let tokenCard = this.data.cards.find(
            (c) => c.card.isNonDeck && c.card.type === 'token creature'
        );

        if (tokenCard) {
            tokenCard.type = 'creature';
            result.tokenCard = this.createCard(player, tokenCard.card);
            result.tokenCard.setupAbilities();
        }

        return result;
    }

    eachRepeatedCard(cards, func) {
        _.each(cards, (cardEntry) => {
            for (let i = 0; i < cardEntry.count; i++) {
                func(cardEntry.card);
            }
        });
    }

    createCard(player, cardData) {
        if (!cardData || !cardData.id) {
            logger.error(`no cardData for ${JSON.stringify(this.data)}`);
            return;
        }

        cardData.image = cardData.cardImage || cardData.id;
        if (cardData.maverick) {
            cardData.house = cardData.maverick;
        } else if (cardData.anomaly) {
            cardData.house = cardData.anomaly;
        }

        if (!cards[cardData.id]) {
            return new Card(player, cardData);
        }

        let cardClass = cards[cardData.id];
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
