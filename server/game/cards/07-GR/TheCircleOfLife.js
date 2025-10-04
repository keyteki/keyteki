const Card = require('../../Card.js');

class TheCircleOfLife extends Card {
    // Each haunted player gains 2.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make {1} gain {2} amber and {3} gain {4} amber',
            effectArgs: (context) => [
                context.player,
                context.player.isHaunted() ? 2 : 0,
                context.player.opponent,
                !!context.player.opponent && context.player.opponent.isHaunted() ? 2 : 0
            ],
            gameAction: [
                ability.actions.conditional((context) => ({
                    condition: context.player.isHaunted(),
                    trueGameAction: ability.actions.gainAmber({
                        target: context.player,
                        amount: 2
                    })
                })),
                ability.actions.conditional((context) => ({
                    condition: !!context.player.opponent && context.player.opponent.isHaunted(),
                    trueGameAction: ability.actions.gainAmber({
                        target: context.player.opponent,
                        amount: 2
                    })
                }))
            ]
        });
    }
}

TheCircleOfLife.id = 'the-circle-of-life';

module.exports = TheCircleOfLife;
