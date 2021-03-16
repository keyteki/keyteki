const Card = require('../../Card.js');

class EclecticAmbrosiusEvilTwin extends Card {
    //At the end of your turn, put a knowledge counter on Ecletic Ambrosius.
    //Action: Remove 3 knowledge counters from Ecletic Ambrosius. If you do, gain 6.
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
                condition: (context) => context.preThenEvent.count >= 3,
                gameAction: ability.action.gainAmber({ amount: 6 })
            }
        });
    }
}

EclecticAmbrosiusEvilTwin.id = 'eclectic-ambrosius-evil-twin';

module.exports = EclecticAmbrosiusEvilTwin;
