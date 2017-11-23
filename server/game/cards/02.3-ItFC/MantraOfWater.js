const DrawCard = require('../../drawcard.js');

class MantraOfWater extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onConflictDeclared: event => event.conflictRing === 'water' && event.conflict.attackingPlayer !== this.controller
            },
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && (card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk'))) && card.bowed
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to ready {2} and draw a card', this.controller, this, context.target);
                this.controller.readyCard(context.target, this);
                this.controller.drawCardsToHand(1);
            }
        });
    }
}

MantraOfWater.id = 'mantra-of-water';

module.exports = MantraOfWater;
