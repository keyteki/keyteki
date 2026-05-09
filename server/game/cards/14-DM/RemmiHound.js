const Card = require('../../Card.js');

class RemmiHound extends Card {
    // Entrench.
    // While Remmi Hound is exhausted, each friendly flank creature gets +4 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.exhausted,
            match: (card, context) =>
                card.type === 'creature' &&
                card.controller === context.source.controller &&
                card.isOnFlank(),
            effect: ability.effects.modifyPower(4)
        });
    }
}

RemmiHound.id = 'remmi-hound';

module.exports = RemmiHound;
