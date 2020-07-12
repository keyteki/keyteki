const Card = require('../../Card.js');

class LuckyDice extends Card {
    setupCardAbilities(ability) {
        this.omni({
            effect:
                "destroy {0} and prevent their creatures from taking damage during opponent's next turn",
            gameAction: ability.actions.sequential([
                ability.actions.destroy(),
                ability.actions.lastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.delayedEffect({
                        when: {
                            onBeginRound: () => context.game.activePlayer !== context.player
                        },
                        gameAction: ability.actions.lastingEffect({
                            targetController: 'current',
                            duration: 1,
                            effect: ability.effects.cardCannot('damage')
                        })
                    })
                }))
            ])
        });
    }
}

LuckyDice.id = 'lucky-dice';

module.exports = LuckyDice;
