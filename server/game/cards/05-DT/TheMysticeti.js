import Card from '../../Card.js';

class TheMysticeti extends Card {
    // Action: Exhaust 1 or more friendly Untamed creatures. If you do, give The Mysticeti three +1 power counters for each creature exhausted this way and move it anywhere in your battleline as a creature with 0 power and taunt.
    setupCardAbilities(ability) {
        this.action({
            target: {
                numCards: 1,
                mode: 'orMore',
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('untamed'),
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.preThenEvents.some((event) => !event.cancelled),
                gameAction: ability.actions.addPowerCounter((context) => ({
                    amount: 3 * context.preThenEvents.filter((event) => !event.cancelled).length
                })),
                then: {
                    alwaysTriggers: true,
                    condition: (context) => context.source.controller === context.game.activePlayer,
                    gameAction: ability.actions.sequential([
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
            }
        });
    }
}

TheMysticeti.id = 'the-mysticeti';

export default TheMysticeti;
