const DrawCard = require('../../drawcard.js');

class Yoritomo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyBothSkills(() => this.controller.fate)
        });
    }
}

Yoritomo.id = 'yoritomo';

module.exports = Yoritomo;
