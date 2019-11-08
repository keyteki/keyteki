const Card = require('../../Card.js');

class PrimusUnguis extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower(() => 2 * this.amber)
        });

        this.reap({
            gameAction: ability.actions.exalt()
        });
    }
}

PrimusUnguis.id = 'primus-unguis';

module.exports = PrimusUnguis;
