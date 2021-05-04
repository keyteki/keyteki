const Card = require('../../Card.js');

class LuckyDice extends Card {
    setupCardAbilities(ability) {
        this.omni({
            effect:
                "destroy {0} and prevent their creatures from taking damage during opponent's next turn",
            gameAction: ability.actions.sequential([
                ability.actions.destroy(),
                ability.actions.lastingEffect({
                    forceNextRound: true,
                    targetController: 'current',
                    effect: ability.effects.cardCannot('damage')
                })
            ])
        });
    }
}

LuckyDice.id = 'lucky-dice';

module.exports = LuckyDice;
