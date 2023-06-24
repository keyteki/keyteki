const Card = require('../../Card.js');

class IxxyxliFixfinger extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Each other Martian creature gets +1armor.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card, context) =>
                card !== context.source && card.hasTrait('martian') && card.type === 'creature',
            effect: ability.effects.modifyArmor(1)
        });
    }
}

IxxyxliFixfinger.id = 'ixxyxli-fixfinger';

module.exports = IxxyxliFixfinger;
