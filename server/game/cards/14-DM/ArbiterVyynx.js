const Card = require('../../Card.js');

class ArbiterVyynx extends Card {
    // After Reap: Destroy a friendly non-Mars creature. If you do, take control of an enemy creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                activePromptTitle: 'Choose a friendly non-Mars creature',
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('mars'),
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    activePromptTitle: 'Choose an enemy creature',
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
