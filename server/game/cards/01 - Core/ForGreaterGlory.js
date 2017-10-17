const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ForGreaterGlory extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onBreakProvince: event => event.conflict.conflictType === 'military' && this.controller.anyCardsInPlay(card => card.isAttacking() && card.hasTrait('bushi'))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to add fate to each of their participating Bushi', this.controller, this);
                _.each(context.event.conflict.attackers, card => {
                    if(card.hasTrait('bushi')) {
                        card.modifyFate(1);
                    }
                });
            }
        });
    }
}

ForGreaterGlory.id = 'for-greater-glory';

module.exports = ForGreaterGlory;
