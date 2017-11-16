const DrawCard = require('../../drawcard.js');

class PathfindersBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Cancel conflict province ability',
            when: {
                onCardAbilityInitiated: event => this.parent.isAttacking && event.card === this.game.currentConflict.conflictProvince
            },
            cost: ability.costs.sacrificeSelf(),
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to cancel the effects of {2}\'s ability', this.controller, this, context.event.card);
                context.cancel();
            }
        });
    }
}

PathfindersBlade.id = 'pathfinder-s-blade';

module.exports = PathfindersBlade;
