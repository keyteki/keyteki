const Card = require('../../Card.js');

class LuckyDice extends Card {
    setupCardAbilities(ability) {
        this.omni({
            effect:
                "destroy {0} and prevent their creatures from taking damage during opponent's next turn",
            gameAction: ability.actions.sequential([
                ability.actions.destroy(),
                ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilNextTurn',
                    target: context.player.creaturesInPlay,
                    effect: ability.effects.cardCannot(
                        'damage',
                        (dcontext) => context.player !== dcontext.game.activePlayer
                    )
                }))
            ])
        });
    }
}

LuckyDice.id = 'lucky-dice';

module.exports = LuckyDice;
