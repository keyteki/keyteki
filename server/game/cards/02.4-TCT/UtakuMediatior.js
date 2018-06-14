const DrawCard = require('../../drawcard.js');

class UtakuMediator extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.controller.imperialFavor === '',
            effect: ability.effects.modifyBothSkills(1)
        });
    }
}

UtakuMediator.id = 'utaku-mediator';

module.exports = UtakuMediator;
