const DrawCard = require('../../drawcard.js');

class BeingAndBecoming extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move each fate from an unclaimed ring to attached character',
            cost: ability.costs.bowParent(),
            target: {
                mode: 'ring',
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: ring => ring.isUnclaimed() && ring.fate > 0,
                gameAction: ability.actions.placeFate(context => ({
                    origin: context.ring,
                    amount: context.ring.fate,
                    target: context.source.parent,
                }))
            },
            effect: 'move {1} fate from {2} to {3}',
            effectArgs: context => [context.ring.fate, context.ring, context.source.parent]
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player) {
            return false;
        }

        return super.canAttach(card, context);
    }
}

BeingAndBecoming.id = 'being-and-becoming';

module.exports = BeingAndBecoming;
