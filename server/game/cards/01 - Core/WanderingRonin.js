const DrawCard = require('../../drawcard.js');

class WanderingRonin extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove 1 fate',
            phase: 'conflict',
            condition: () => this.game.currentConflict,
            cost: ability.costs.discardFate(1),
            limit: ability.limit.perConflict(2),
            handler: () => {
                this.game.addMessage('{0} removes a fate from {1} to give it +2 military and +2 political until the end of the conflict', this.controller, this);
                this.untilEndOfConflict(ability => ({
                    match: this,
                    effect: [
                        ability.effects.modifyMilitarySkill(2),
                        ability.effects.modifyPoliticalSkill(2)
                    ]
                }));
            }
        });
    }
}

WanderingRonin.id = 'wandering-ronin';

module.exports = WanderingRonin;
