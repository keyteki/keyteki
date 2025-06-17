const Card = require('../../Card.js');

class LuminousBoom extends Card {
    // Enhance 1.
    // Play: You may discard a Sanctum card. If you do, a friendly creature captures all of your opponent's A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.hand.filter((card) => card.hasHouse('sanctum')).length > 0,
            target: {
                location: 'hand',
                controller: 'self',
                optional: true,
                cardCondition: (card) => card.hasHouse('sanctum'),
                gameAction: ability.actions.discard()
            },
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.capture((context) => ({
                        amount: context.player.opponent.amber
                    }))
                }
            }
        });
    }
}

LuminousBoom.id = 'luminous-boom';

module.exports = LuminousBoom;
