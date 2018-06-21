const DrawCard = require('../../drawcard.js');

class WanderingRonin extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give this character +2/+2',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.removeFateFromSelf(),
            effect: 'give himself +2{1}/+2{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(2) }),
            limit: ability.limit.perConflict(2)
        });
    }
}

WanderingRonin.id = 'wandering-ronin';

module.exports = WanderingRonin;
