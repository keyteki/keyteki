const Card = require('../../Card.js');

class EffigyOfMelerukh extends Card {
    //After an enemy creature reaps, put a counter on (this artifact). When there are 6 or more counters, move this card to a flank of your battleline. While in the battleline, it is a creature with 100 power and 100 armor.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.controller !== context.player &&
                    event.card.type === 'creature' &&
                    context.source.type === 'artifact'
            },
            gameAction: ability.actions.addAwakeningCounter(),
            then: {
                condition: (context) =>
                    context.source.hasToken('awakening') && context.source.tokens.awakening >= 6,
                message: '{1} has 6 counters and moves to flank.',
                messageArgs: (context) => [context.source],
                gameAction: ability.actions.sequential([
                    ability.actions.cardLastingEffect((context) => ({
                        target: context.source,
                        duration: 'lastingEffect',
                        effect: [
                            ability.effects.changeType('creature'),
                            ability.effects.canUse((card) => card === context.source),
                            ability.effects.modifyPower(100),
                            ability.effects.modifyArmor(100)
                        ]
                    })),
                    ability.actions.moveToFlank()
                ])
            }
        });
    }
}

EffigyOfMelerukh.id = 'effigy-of-melerukh';

module.exports = EffigyOfMelerukh;
