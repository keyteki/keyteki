const Card = require('../../Card.js');

class HarlandMindlock extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    duration: 'lastingEffect',
                    effect: ability.effects.customDetachedCard({
                        apply: (card) =>
                            card.lastingEffect((ability) => ({
                                match: context.target,
                                effect: ability.effects.takeControl(context.player)
                            })),
                        unapply: (card, context, effect) => card.removeEffectFromEngine(effect)
                    })
                }))
            },
            effect: 'take control of {0}'
        });
    }
}

HarlandMindlock.id = 'harland-mindlock';

module.exports = HarlandMindlock;
