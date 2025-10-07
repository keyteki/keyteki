import Card from '../../Card.js';

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
                        condition: context.player.opponent && context.player.opponent.isHaunted(),
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
                context.player,
                Math.min(
                    context.player.opponent && context.player.opponent.isHaunted() ? 2 : 0,
                    context.player.opponent ? context.player.opponent.amber : 0
                ),
                context.player.opponent
            ]
        });
    }
}

Circlespeak.id = 'circlespeak';

export default Circlespeak;
