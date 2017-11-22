const DrawCard = require('../../drawcard.js');

class HidaTomonatsu extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Return a character to deck',
            when: {
                afterConflict: event => event.conflict.winner === this.controller && event.conflict.isDefending(this)
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isAttacking() && !card.isUnique()
            },
            handler: context => {
                this.game.addMessage('{0} activates {1} to move {2} to the top of {3}\'s deck', context.cardStateWhenInitiated.controller, this, context.target, context.target.controller);
                context.target.owner.moveCardToTopOfDeck(context.target);
            }
        });
    }
}

HidaTomonatsu.id = 'hida-tomonatsu';

module.exports = HidaTomonatsu;
