const Card = require('../../Card.js');

class TheMysticeti extends Card {
    setupCardAbilities(ability) {
        // Action: Exhaust 1 or more friendly Untamed creatures. If you do, give The Mysticeti three +1 power
        // counters for each creature exhausted this way and move it anywhere in your battleline as a creature
        // with 0 power and taunt.
        this.action({
            target: {
                numCards: 1,
                mode: 'orMore',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.preThenEvents.some((event) => !event.cancelled),
                gameAction: ability.actions.sequential([
                    ability.actions.addPowerCounter((context) => ({
                        amount: context.preThenEvents.filter((event) => !event.cancelled).length
                    })),
                    ability.actions.cardLastingEffect((context) => ({
                        target: context.source,
                        duration: 'lastingEffect',
                        effect: [
                            ability.effects.changeType('creature'),
                            ability.effects.addKeyword({ taunt: 1 })
                        ]
                    })),
                    ability.actions.moveOnBattleline((context) => ({
                        player: context.player
                    }))
                ])
            }
        });
    }
}

TheMysticeti.id = 'the-mysticeti';

module.exports = TheMysticeti;
