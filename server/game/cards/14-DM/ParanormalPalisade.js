const Card = require('../../Card.js');

class ParanormalPalisade extends Card {
    // Entrench.
    // While Paranormal Palisade is exhausted, it gets +4 armor and gains taunt.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.exhausted,
            match: (card) => card === this,
            effect: [ability.effects.modifyArmor(4), ability.effects.addKeyword({ taunt: 1 })]
        });
    }
}

ParanormalPalisade.id = 'paranormal-palisade';

module.exports = ParanormalPalisade;
