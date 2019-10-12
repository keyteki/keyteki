const Card = require('../../Card.js');

class MegaGronNineToes extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.tokens.damage > 0,
            effect: ability.effects.modifyPower(4)
        });
    }
}

MegaGronNineToes.id = 'mega-gron-nine-toes';

module.exports = MegaGronNineToes;
