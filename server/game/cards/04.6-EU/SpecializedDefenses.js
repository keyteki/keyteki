const DrawCard = require('../../drawcard.js');

class SpecializedDefenses extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Double province strength',
            condition: context => {
                if(!this.game.isDuringConflict()) {
                    return false;
                }
                let element = this.game.currentConflict.conflictProvince.element;
                return this.game.rings[element].isConsideredClaimed(context.player) ||
                       this.game.currentConflict.ring.getElements().includes(element);
            },
            effect: 'double {1}\'s province strength',
            effectArgs: context => context.game.currentConflict.conflictProvince,
            gameAction: ability.actions.cardLastingEffect(() => ({
                target: this.game.currentConflict.conflictProvince,
                targetLocation: 'province',
                effect: ability.effects.modifyProvinceStrengthMultiplier(2)
            }))
        });
    }
}

SpecializedDefenses.id = 'specialized-defenses';

module.exports = SpecializedDefenses;
