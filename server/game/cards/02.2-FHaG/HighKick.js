const DrawCard = require('../../drawcard.js');

class HighKick extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow and Disable a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            cost: ability.costs.bow(card => card.hasTrait('monk') && card.isParticipating()),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating() && card.controller !== this.controller
            },
            handler: context => {
                this.game.addMessage('{0} uses {1}\'s ability to bow and prevent {2} from using any abilities', this.controller, this, context.target);
                this.controller.bowCard(context.target, context.source);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.cardCannotTriggerAbilities()
                }));
            }
        });
    }
}

HighKick.id = 'high-kick';

module.exports = HighKick;
