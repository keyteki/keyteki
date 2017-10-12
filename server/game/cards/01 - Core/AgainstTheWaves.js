const DrawCard = require('../../drawcard.js');

class AgainstTheWaves extends DrawCard {
    setupCardAbilities() {
        this.action({
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.hasTrait('shugenja') && (card.bowed || card.allowGameAction('bow'))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to {2} {3}', this.controller, this, context.target.bowed ? 'unbow' : 'bow', context.target);
                if(context.target.bowed) {
                    this.controller.readyCard(context.target);
                } else {
                    this.controller.bowCard(context.target);
                }
            }
        });
    }
}

AgainstTheWaves.id = 'against-the-waves';

module.exports = AgainstTheWaves;
