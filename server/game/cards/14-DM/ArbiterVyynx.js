const Card = require('../../Card.js');

class ArbiterVyynx extends Card {
    // After Reap: Destroy a friendly non-Mars creature. If you do, take control of an enemy creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('mars'),
                gameAction: ability.actions.destroy()
            },
            then: {
                message: '{0} uses {1} to take control of {2}',
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.takeControl(context.player)
                    }))
                }
            }
        });
    }
}

ArbiterVyynx.id = 'arbiter-vyynx';

module.exports = ArbiterVyynx;
