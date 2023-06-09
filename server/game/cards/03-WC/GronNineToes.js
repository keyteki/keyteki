const Card = require('../../Card.js');

class GronNineToes extends Card {
    // Gron Nine-Toes gets +4 power while it is damaged. (Gron Nine-Toes gets the power bonus only if he survives the damage.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.tokens.damage > 0,
            effect: ability.effects.modifyPower(4)
        });
    }
}

GronNineToes.id = 'gron-nine-toes';

module.exports = GronNineToes;
