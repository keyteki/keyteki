const DrawCard = require('../../drawcard.js');

class IkomaReservist extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.rings.fire.isConsideredClaimed(this.controller) ||
                this.game.rings.water.isConsideredClaimed(this.controller)
            ),
            match: this,
            effect: ability.effects.modifyMilitarySkill(2)
        });
    }
}

IkomaReservist.id = 'ikoma-reservist';

module.exports = IkomaReservist;
