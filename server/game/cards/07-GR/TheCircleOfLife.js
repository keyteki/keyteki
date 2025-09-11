const Card = require('../../Card.js');

class TheCircleOfLife extends Card {
    // Each haunted player gains 2.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make each haunted player gain 2 amber',
            gameAction: [
                ability.actions.conditional((context) => ({
                    condition: !!context.player.opponent && context.player.opponent.isHaunted(),
                    trueGameAction: ability.actions.gainAmber({
                        target: context.player.opponent,
                        amount: 2
                    })
                })),
                ability.actions.conditional((context) => ({
                    condition: context.player.isHaunted(),
                    trueGameAction: ability.actions.gainAmber({
                        target: context.player,
                        amount: 2
                    })
                }))
            ]
        });
    }
}

TheCircleOfLife.id = 'the-circle-of-life';

module.exports = TheCircleOfLife;
