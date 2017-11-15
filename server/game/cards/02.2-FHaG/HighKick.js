const DrawCard = require('../../drawcard.js');

class HighKick extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow and Disable a character',
            //TODO--Also we have a marticipating monk character
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military' && this.controller.anyCardsInPlay(card => card.hasTrait('monk') && card.isParticipating()),
            cost: ability.costs.bow(card => card.hasTrait('monk') && this.game.currentConflict && card.isParticipating() && this.controller === card.controller),
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
