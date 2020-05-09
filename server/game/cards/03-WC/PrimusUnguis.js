const Card = require('../../Card.js');

class PrimusUnguis extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: () => true,
            effect: ability.effects.modifyPower((card, context) => 2 * context.source.amber)
        });

        this.reap({
            gameAction: ability.actions.exalt()
        });
    }
}

PrimusUnguis.id = 'primus-unguis';

module.exports = PrimusUnguis;
