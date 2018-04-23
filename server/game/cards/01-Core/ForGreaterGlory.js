const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ForGreaterGlory extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put a fate on all your bushi in this conflict',
            when: {
                onBreakProvince: (event, context) => event.conflict.conflictType === 'military' && this.controller.anyCardsInPlay(card => (
                    card.isAttacking() && card.hasTrait('bushi') && 
                    card.allowGameAction('placeFate', context)
                ))
            },
            max: ability.limit.perConflict(1),
            handler: context => {
                this.game.addMessage('{0} uses {1} to add fate to each of their participating Bushi', this.controller, this);
                this.game.applyGameAction(context, { placeFate: _.filter(context.event.conflict.attackers, card => card.hasTrait('bushi')) });
            }
        });
    }
}

ForGreaterGlory.id = 'for-greater-glory';

module.exports = ForGreaterGlory;
