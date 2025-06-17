const Card = require('../../Card.js');

class DroseraRelic extends Card {
    // Action: Destroy the least powerful friendly creature. If you do, steal 2.
    // Fate: Destroy the least powerful friendly creature. If you do, pay your opponent 2.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'leastStat',
                cardType: 'creature',
                controller: 'self',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.steal({ amount: 2 }),
                message: '{0} uses {1} to steal 2 amber'
            }
        });

        this.fate({
            target: {
                mode: 'leastStat',
                cardType: 'creature',
                controller: 'opponent',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.transferAmber({ amount: 2 }),
                message: '{0} uses {1} to get paid 2 amber from {3}',
                messageArgs: (context) => [context.game.activePlayer]
            }
        });
    }
}

DroseraRelic.id = 'drosera-relic';

module.exports = DroseraRelic;
