const Card = require('../../Card.js');

class TouristTrap extends Card {
    // Play: Make a token creature.
    //
    // Action: Choose a friendly token creature and an enemy
    // creature. If you do, swap control of those creatures.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.action({
            condition: (context) =>
                context.player.creaturesInPlay.length > 0 &&
                context.player.opponent &&
                context.player.opponent.creaturesInPlay.length > 0,
            targets: {
                first: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => card.isToken()
                },
                second: {
                    dependsOn: 'first',
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: [
                        ability.actions.cardLastingEffect((context) => ({
                            target: context.targets.first,
                            duration: 'lastingEffect',
                            effect: ability.effects.takeControl(context.game.activePlayer.opponent)
                        })),
                        ability.actions.cardLastingEffect((context) => ({
                            target: context.targets.first,
                            effect: ability.effects.takeControlOn(
                                context.game.activePlayer.opponent.cardsInPlay.indexOf(
                                    context.targets.second
                                )
                            )
                        })),
                        ability.actions.cardLastingEffect((context) => ({
                            target: context.targets.second,
                            duration: 'lastingEffect',
                            effect: ability.effects.takeControl(context.game.activePlayer)
                        })),
                        ability.actions.cardLastingEffect((context) => ({
                            target: context.targets.second,
                            effect: ability.effects.takeControlOn(
                                context.game.activePlayer.cardsInPlay.indexOf(context.targets.first)
                            )
                        }))
                    ]
                }
            }
        });
    }
}

TouristTrap.id = 'tourist-trap';

module.exports = TouristTrap;
