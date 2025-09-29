const Card = require('../../Card.js');

class Circlespeak extends Card {
    // Play: Choose a creature. It captures 2A from each haunted player.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'any',
                gameAction: [
                    ability.actions.conditional((context) => ({
                        condition: context.player.isHaunted(),
                        trueGameAction: ability.actions.capture((context) => ({
                            amount: 2,
                            player: context.player,
                            target: context.target
                        }))
                    })),
                    ability.actions.conditional((context) => ({
                        condition: !!context.player.opponent && context.player.opponent.isHaunted(),
                        trueGameAction: ability.actions.capture((context) => ({
                            amount: 2,
                            player: context.player.opponent,
                            target: context.target
                        }))
                    }))
                ]
            },
            effect: 'capture {1} amber from {2} and {3} amber from {4} onto {0}',
            effectArgs: (context) => [
                Math.min(context.player.isHaunted() ? 2 : 0, context.player.amber),
                context.player.name,
                Math.min(
                    context.player.opponent.isHaunted() ? 2 : 0,
                    context.player.opponent.amber
                ),
                context.player.opponent.name
            ]
        });
    }
}

Circlespeak.id = 'circlespeak';

module.exports = Circlespeak;
