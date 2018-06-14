const DrawCard = require('../../drawcard.js');

class TogashiInitiate extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor this character',
            condition: context => context.source.isAttacking(),
            cost: ability.costs.payFateToRing(1),
            gameAction: ability.actions.honor()
        });
    }
}

TogashiInitiate.id = 'togashi-initiate';

module.exports = TogashiInitiate;
