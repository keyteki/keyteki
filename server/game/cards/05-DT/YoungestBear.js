const Card = require('../../Card.js');

class YoungestBear extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                optional: true,
                cardCondition: (card, context) =>
                    card.exhausted === false && context.source.neighbors.includes(card),
                gameAction: ability.actions.reap()
            }
        });
    }
}

YoungestBear.id = 'youngest-bear';

module.exports = YoungestBear;
