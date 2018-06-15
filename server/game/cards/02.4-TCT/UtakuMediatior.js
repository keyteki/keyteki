const DrawCard = require('../../drawcard.js');

class UtakuMediator extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.controller.imperialFavor === '',
            effect: [
                ability.effects.modifyMilitarySkill(1),
                ability.effects.modifyPoliticalSkill(1)
            ]
        });
    }
}

UtakuMediator.id = 'utaku-mediator';

module.exports = UtakuMediator;
