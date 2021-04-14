const Card = require('../../Card.js');

class EclecticAmbrosius extends Card {
    // At the end of your turn, put a knowledge counter on Eclectic Ambrosius.
    // Action: Remove 3 knowledge counters from Eclectic Ambrosius. If you do, gain 6A.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.addKnowledgeCounter()
        });

        this.action({
            gameAction: ability.actions.removeKnowledgeCounter({ amount: 3 }),
            then: {
                condition: (context) => context.preThenEvent.amount >= 3,
                gameAction: ability.actions.gainAmber({ amount: 6 })
            }
        });
    }
}

EclecticAmbrosius.id = 'eclectic-ambrosius';

module.exports = EclecticAmbrosius;
