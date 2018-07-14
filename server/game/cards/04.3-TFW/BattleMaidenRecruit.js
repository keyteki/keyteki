const DrawCard = require('../../drawcard.js');

class BattleMaidenRecruit extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.rings.water.isConsideredClaimed(this.controller) ||
                this.game.rings.void.isConsideredClaimed(this.controller)
            ),
            match: this,
            effect: ability.effects.modifyMilitarySkill(2)
        });
    }
}

BattleMaidenRecruit.id = 'battle-maiden-recruit';

module.exports = BattleMaidenRecruit;
