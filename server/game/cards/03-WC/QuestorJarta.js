const Card = require('../../Card.js');

class QuestorJarta extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Reap: You may exalt Questor Jarta. If you do, gain 1A.
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            effect: 'exalt {0} and gain 1 amber',
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

QuestorJarta.id = 'questor-jarta';

module.exports = QuestorJarta;
