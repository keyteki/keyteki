const Card = require('../../Card.js');

class Spendthrift extends Card {
    // Play: Move each A from a creature to the common supply. Exalt that creature.
    // Fate: Move each A from enemy creatures to your opponent's pool.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: [ability.actions.removeAmber({ all: true }), ability.actions.exalt()]
            },
            effect: 'move all {2} amber from {0} to the common supply and exalt {0}',
            effectArgs: (context) => [context.target, context.target.tokens.amber || 0]
        });

        this.fate({
            effect: "move all {1} amber from enemy creatures to their opponent's pool",
            effectArgs: (context) => [
                context.game.activePlayer.opponent.creaturesInPlay.reduce(
                    (total, card) => total + card.amber,
                    0
                )
            ],
            gameAction: [
                ability.actions.removeAmber((context) => ({
                    all: true,
                    target: context.game.activePlayer.opponent.creaturesInPlay.filter((card) =>
                        card.hasToken('amber')
                    )
                })),
                ability.actions.gainAmber((context) => ({
                    target: context.game.activePlayer.opponent,
                    amount: context.game.activePlayer.opponent.creaturesInPlay.reduce(
                        (total, card) => total + card.amber,
                        0
                    )
                }))
            ]
        });
    }
}

Spendthrift.id = 'spendthrift';

module.exports = Spendthrift;
