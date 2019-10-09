const Card = require('../../Card.js');

class QuestorJarta extends Card {
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
