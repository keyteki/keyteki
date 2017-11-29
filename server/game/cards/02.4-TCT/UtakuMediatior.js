const DrawCard = require('../../drawcard.js');

class UtakuMediatior extends DrawCard {
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

UtakuMediatior.id = 'utaku-mediatior';

module.exports = UtakuMediatior;
