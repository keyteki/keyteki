const DrawCard = require('../../drawcard.js');

class GuardianKami extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Resolve ring effect',
            cost: ability.costs.sacrificeSelf(),
            max: ability.limit.perConflict(1),
            condition: context => context.source.isDefending(),
            gameAction: ability.actions.resolveConflictRing()
        });
    }
}

GuardianKami.id = 'guardian-kami';

module.exports = GuardianKami;
