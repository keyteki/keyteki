const DrawCard = require('../../drawcard.js');

class AsahinaArtisan extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character +3P',
            cost: ability.costs.bowSelf(),
            target: {
                cardType: 'character',
                cardCondition: card => this.game.currentConflict && card !== this && card.isFaction('crane') && card.location === 'play area'
            },
            handler: context => {
                this.game.addMessage('{0} bows {1} to give {2} 3 additional political skill', this.controller, this, context.target);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyPoliticalSkill(3)
                }));
            }
        });
    }
}

AsahinaArtisan.id = 'asahina-artisan';

module.exports = AsahinaArtisan;
