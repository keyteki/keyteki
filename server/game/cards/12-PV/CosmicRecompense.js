const Card = require('../../Card.js');

class CosmicRecompense extends Card {
    // Play: Deal 3D to an enemy creature. If it is not destroyed, steal 1A. Repeat the preceding effect.
    // Fate: You cannot play, use, or discard cards for the remainder of the turn.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.creaturesInPlay.length > 0,
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.sequential([
                    ability.actions.dealDamage({ amount: 3 }),
                    ability.actions.steal((context) => ({
                        target: context.player.opponent,
                        amount: context.target
                            ? context.target.location === 'play area'
                                ? 1
                                : 0
                            : 0
                    }))
                ])
            },
            effect: 'deal 3 damage to {0} and steal 1 amber from {1} if it is not destroyed',
            effectArgs: (context) => [context.player.opponent],
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.sequential([
                        ability.actions.dealDamage({ amount: 3 }),
                        ability.actions.steal((context) => ({
                            target: context.player.opponent,
                            amount: context.target
                                ? context.target.location === 'play area'
                                    ? 1
                                    : 0
                                : 0
                        }))
                    ])
                },
                message:
                    '{0} uses {1} to deal 3 damage to {3} and steal 1 amber from {4} if it is not destroyed',
                messageArgs: (context) => [context.target, context.player.opponent]
            }
        });

        this.fate({
            effect: 'prevent playing, using, or discarding cards for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn({
                targetController: 'opponent',
                effect: [
                    ability.effects.playerCannot('play'),
                    ability.effects.playerCannot('use'),
                    ability.effects.playerCannot('discard')
                ]
            })
        });
    }
}

CosmicRecompense.id = 'cosmic-recompense';

module.exports = CosmicRecompense;
