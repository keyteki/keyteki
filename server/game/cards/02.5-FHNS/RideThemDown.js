const DrawCard = require('../../drawcard.js');

class RideThemDown extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce province strength',
            cost: ability.costs.discardImperialFavor(),
            condition: () => this.game.currentConflict(),
            handler: () => {
                let strengthToReduce = (this.game.currentConflict.conflictProvince.getBaseStrength() - 1) * -1;
                this.game.addMessage('{0} uses {1} to reduce the strength of {2} by {3}', this.controller, this, this.game.currentConflict.conflictProvince, -strengthToReduce);
                this.game.currentConflict.conflictProvince.modifyProvinceStrength(strengthToReduce);
            }
        });
    }
}

RideThemDown.id = 'ride-them-down';

module.exports = RideThemDown;
