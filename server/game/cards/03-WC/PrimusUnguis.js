const Card = require('../../Card.js');

class PrimusUnguis extends Card {
    // Each friendly creature gets +2 power for each  on Primus Unguis.
    // Reap: Exalt Primus Unguis.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: ability.effects.modifyPower((card, context) => 2 * context.source.amber)
        });

        this.reap({
            gameAction: ability.actions.exalt()
        });
    }
}

PrimusUnguis.id = 'primus-unguis';

module.exports = PrimusUnguis;
