const DrawCard = require('../../drawcard.js');

class StoicGunso extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice a character for +3/+0',
            condition: () => this.game.currentConflict,
            cost: ability.costs.sacrifice(card => card.type === 'character'),
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to give {2} +3/+0', this.controller, context.sacrificeCostCard, this);
                this.untilEndOfConflict(ability => ({
                    match: this,
                    effect: ability.effects.modifyMilitarySkill(3)
                }));
            }
        });
    }
}

StoicGunso.id = 'stoic-gunso';

module.exports = StoicGunso;
