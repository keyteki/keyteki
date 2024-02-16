const Card = require('../../Card.js');

class StrangeTorpedo extends Card {
    // Play: Deal 1 D to a creature, with 1 D splash. If your opponent
    // is haunted, stun and exhaust each creature damaged in this way.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 1,
                    splash: 1
                })
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    !!context.player.opponent && context.player.opponent.isHaunted(),
                gameAction: [
                    ability.actions.stun((context) => ({
                        target: context.preThenEvents
                            .filter(
                                (event) =>
                                    event.damageSource === context.source &&
                                    event.amountApplied > 0 &&
                                    event.card.location === 'play area'
                            )
                            .map((event) => event.card)
                    })),
                    ability.actions.exhaust((context) => ({
                        target: context.preThenEvents
                            .filter(
                                (event) =>
                                    event.damageSource === context.source &&
                                    event.amountApplied > 0 &&
                                    event.card.location === 'play area'
                            )
                            .map((event) => event.card)
                    }))
                ],
                message: '{0} uses {1} to stun and exhaust the creatures damaged by {1}'
            }
        });
    }
}

StrangeTorpedo.id = 'strange-torpedo';

module.exports = StrangeTorpedo;
