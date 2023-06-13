const Card = require('../../Card.js');

class ExchangeProgram extends Card {
    // Play: Choose a friendly flank creature and an enemy flank
    // creature. If you do, swap control of those creatures.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.creaturesInPlay.length > 0 &&
                context.player.opponent.creaturesInPlay.length > 0,
            targets: {
                first: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => card.isOnFlank()
                },
                second: {
                    dependsOn: 'first',
                    cardType: 'creature',
                    controller: 'opponent',
                    cardCondition: (card) => card.isOnFlank(),
                    gameAction: [
                        ability.actions.cardLastingEffect((context) => ({
                            target: context.targets.second,
                            duration: 'lastingEffect',
                            effect: ability.effects.takeControl(context.player)
                        })),
                        ability.actions.cardLastingEffect((context) => ({
                            target: context.targets.second,
                            effect: ability.effects.takeControlOn(
                                context.player.cardsInPlay.indexOf(context.targets.first)
                            )
                        })),
                        ability.actions.cardLastingEffect((context) => ({
                            target: context.targets.first,
                            duration: 'lastingEffect',
                            effect: ability.effects.takeControl(context.player.opponent)
                        })),
                        ability.actions.cardLastingEffect((context) => ({
                            target: context.targets.first,
                            effect: ability.effects.takeControlOn(
                                context.player.opponent.cardsInPlay.indexOf(context.targets.second)
                            )
                        }))
                    ]
                }
            }
        });
    }
}

ExchangeProgram.id = 'exchange-program';

module.exports = ExchangeProgram;
