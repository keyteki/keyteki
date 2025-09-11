const Card = require('../../Card.js');

class HadrianusLorica extends Card {
    // Each friendly creature with A on it gets +3 armor.
    // Play: You may exalt Hadrianus Lorica.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.amber > 0,
            effect: ability.effects.modifyArmor(3)
        });

        this.play({
            optional: true,
            gameAction: ability.actions.exalt()
        });
    }
}

HadrianusLorica.id = 'hadrianus-lorica';

module.exports = HadrianusLorica;
