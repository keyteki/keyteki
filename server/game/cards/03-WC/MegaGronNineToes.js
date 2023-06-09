const Card = require('../../Card.js');

class MegaGronNineToes extends Card {
    // Mega Gron Nine-Toes gets +4 power while it is damaged. (Mega Gron Nine-Toes gets the power bonus only if he survives the damage.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.tokens.damage > 0,
            effect: ability.effects.modifyPower(4)
        });
    }
}

MegaGronNineToes.id = 'mega-gron-nine-toes';

module.exports = MegaGronNineToes;
