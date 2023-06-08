const Card = require('../../Card.js');

class Knightapult extends Card {
    // Action: The next time a friendly creature enters play this turn, you may have it enter anywhere in your battleline, ready.
    setupCardAbilities(ability) {
        this.action({
            effect: 'have the next friendly creature enter play anywhere in your battleline, ready',
            gameAction: [
                ability.actions.forRemainderOfTurn((context) => ({
                    when: {
                        onAbilityInitiated: (event) =>
                            event.player === context.player &&
                            event.card.type === 'creature' &&
                            event.context.ability.title === 'Play this creature'
                    },
                    location: 'any',
                    multipleTrigger: false,
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        targetLocation: 'play area',
                        target: context.event.card,
                        effect: [
                            ability.effects.entersPlayAnywhere(),
                            ability.effects.entersPlayReady(),
                            ability.effects.addKeyword({ deploy: 1 })
                        ]
                    })),
                    effect: 'have {1} enter play anywhere in their battleline, ready',
                    effectArgs: (event) => [event.card]
                })),
                ability.actions.forRemainderOfTurn((context) => ({
                    when: {
                        onCardPlayed: (event) =>
                            event.player === context.player && event.card.type === 'creature'
                    },
                    multipleTrigger: false,
                    triggeredAbilityType: 'interrupt',
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        targetLocation: 'play area',
                        target: context.event.card,
                        effect: [
                            ability.effects.entersPlayAnywhere(),
                            ability.effects.entersPlayReady()
                        ]
                    })),
                    effect: 'have {1} enter play anywhere in their battleline, ready',
                    effectArgs: (event) => [event.card]
                }))
            ]
        });
    }
}

Knightapult.id = 'knightapult';

module.exports = Knightapult;
