const DrawCard = require('../../drawcard.js');

class ThirdTowerGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.rings.earth.isConsideredClaimed(this.controller) ||
                this.game.rings.water.isConsideredClaimed(this.controller)
            ),
            match: this,
            effect: ability.effects.modifyMilitarySkill(2)
        });
    }
}

ThirdTowerGuard.id = 'third-tower-guard';

module.exports = ThirdTowerGuard;
