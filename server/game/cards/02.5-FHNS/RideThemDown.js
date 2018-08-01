const DrawCard = require('../../drawcard.js');

class RideThemDown extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce province strength',
            cost: ability.costs.discardImperialFavor(),
            condition: () => this.game.isDuringConflict(),
            effect: 'reduce the strength of {0} to 1',
            gameAction: ability.actions.cardLastingEffect(() => ({
                target: this.game.currentConflict.conflictProvince,
                targetLocation: 'province',
                effect: ability.effects.setBaseProvinceStrength(1)
            }))
        });
    }
}

RideThemDown.id = 'ride-them-down';

module.exports = RideThemDown;
