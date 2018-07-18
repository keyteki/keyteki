const DrawCard = require('../../drawcard.js');

class VolcanicTroll extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.game.rings['fire'].isUnclaimed(),
            effect: ability.effects.modifyBothSkills(2)
        });
    }
}

VolcanicTroll.id = 'volcanic-troll';

module.exports = VolcanicTroll;
