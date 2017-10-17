const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class MantraOfFire extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onConflictDeclared: event => event.conflictRing === 'fire'
            },
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && (card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk')))
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to add fate to {2} and draw a card', this.controller, this, context.target);
                context.target.modifyFate(1);
                this.controller.drawCardsToHand(1);
            }
        });
    }
}

MantraOfFire.id = 'mantra-of-fire';

module.exports = MantraOfFire;
