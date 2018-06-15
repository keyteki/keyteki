const DrawCard = require('../../drawcard.js');

class MantraOfWater extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Ready a monk and draw a card',
            when: {
                onConflictDeclared: event => event.conflictRing === 'water' && event.conflict.attackingPlayer !== this.controller
            },
            target: {
                cardType: 'character',
                gameAction: 'ready',
                cardCondition: card => card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk'))
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to ready {2} and draw a card', this.controller, this, context.target);
                this.game.applyGameAction(context, { ready: context.target });
                this.controller.drawCardsToHand(1);
            }
        });
    }
}

MantraOfWater.id = 'mantra-of-water';

module.exports = MantraOfWater;
