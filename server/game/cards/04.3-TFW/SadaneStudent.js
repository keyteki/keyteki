const DrawCard = require('../../drawcard.js');

class SadaneStudent extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.rings.air.isConsideredClaimed(this.controller) ||
                this.game.rings.fire.isConsideredClaimed(this.controller)
            ),
            match: this,
            effect: ability.effects.modifyPoliticalSkill(2)
        });
    }
}

SadaneStudent.id = 'sadane-student';

module.exports = SadaneStudent;
