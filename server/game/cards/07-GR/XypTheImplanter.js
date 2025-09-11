const Card = require('../../Card.js');

class XypTheImplanter extends Card {
    // After Reap: Take control of an enemy creature. Destroy a
    // friendly creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {1}',
            effectArgs: (context) => [context.target ? context.target : 'nothing'],
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.destroy()
                },
                message: '{0} uses {1} to destroy {3}',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

XypTheImplanter.id = 'xyp-the-implanter';

module.exports = XypTheImplanter;
