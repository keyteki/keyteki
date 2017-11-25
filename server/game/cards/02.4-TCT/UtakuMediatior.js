const DrawCard = require('../../drawcard.js');

class UtakuMediatior extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            contition: () => this.controller.imperialFavor === ''
            effect: [
                ability.effects.ModifyMilitarySkill(1),
                ability.effects.modifyPoliticalSkill(1)
            ]
        });
    }
}

UtakuMediatior.id = 'utaku-mediatior';

module.exports = UtakuMediatior;
