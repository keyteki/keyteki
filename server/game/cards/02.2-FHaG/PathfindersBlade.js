const DrawCard = require('../../drawcard.js');

class PathfindersBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Cancel conflict province ability',
            when: {
                onCardAbilityInitiated: (event, context) => context.source.parent.isAttacking() && event.card.isConflictProvince()
            },
            cost: ability.costs.sacrificeSelf(),
            effect: 'cancel the effects of {0}\'s ability',
            effectArgs: context => context.event.card,
            handler: context => context.cancel()
        });
    }
}

PathfindersBlade.id = 'pathfinder-s-blade';

module.exports = PathfindersBlade;
