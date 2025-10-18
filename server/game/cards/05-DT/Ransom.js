const Card = require('../../Card.js');

class Ransom extends Card {
    // This creature cannot be used and gains, "At the start of your turn, you may give your opponent 2A. If you do, destroy Ransom."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.cardCannot('use'),
                ability.effects.gainAbility('reaction', {
                    when: {
                        onTurnStart: (_event, context) =>
                            context.player === context.game.activePlayer
                    },
                    condition: (context) => context.player.amber >= 2,
                    optional: true,
                    gameAction: [
                        ability.actions.loseAmber((context) => ({
                            target: context.player,
                            amount: 2
                        })),
                        ability.actions.gainAmber((context) => ({
                            target: context.player.opponent,
                            amount: 2
                        })),
                        ability.actions.destroy({
                            target: this
                        })
                    ],
                    effect: 'give 2 amber to {1} and destroy {2}',
                    effectArgs: (context) => [context.player.opponent, this]
                })
            ]
        });
    }
}

Ransom.id = 'ransom';

module.exports = Ransom;
