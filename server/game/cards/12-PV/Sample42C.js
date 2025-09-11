const Card = require('../../Card.js');

class Sample42C extends Card {
    // Action: Move 1A from your opponent’s pool to Sample 42-C.
    // If there are 4A or more on Sample 42-C, forge a key at no cost and purge Sample 42-C.
    // Fate: The most powerful enemy creature captures half of your A (rounding down).
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => !!context.player.opponent,
            effect: 'move 1 amber from {1} to {0}',
            effectArgs: (context) => [context.player.opponent],
            gameAction: [
                ability.actions.loseAmber((context) => ({
                    target: context.player.opponent,
                    amount: 1
                })),
                ability.actions.placeAmber()
            ],
            then: {
                condition: (context) => context.source.amber >= 4,
                gameAction: [ability.actions.forgeKey({ atNoCost: true }), ability.actions.purge()],
                message: '{0} uses {1} to forge a key at no cost'
            }
        });

        this.fate({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'self',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.capture((context) => ({
                    amount: Math.floor(context.game.activePlayer.amber / 2)
                }))
            }
        });
    }
}

Sample42C.id = 'sample-42-c';

module.exports = Sample42C;
