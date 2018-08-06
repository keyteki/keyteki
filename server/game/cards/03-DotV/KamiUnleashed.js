const DrawCard = require('../../drawcard.js');

class KamiUnleashed extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Resolve ring effect',
            cost: ability.costs.sacrificeSelf(),
            max: ability.limit.perConflict(1),
            condition: context => context.source.isAttacking(),
            gameAction: ability.actions.resolveConflictRing()
        });
    }
}

KamiUnleashed.id = 'kami-unleashed';

module.exports = KamiUnleashed;
