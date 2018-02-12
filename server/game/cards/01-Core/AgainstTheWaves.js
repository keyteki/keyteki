const DrawCard = require('../../drawcard.js');

class AgainstTheWaves extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow or ready a shugenja',
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.location === 'play area' && card.hasTrait('shugenja') && (card.bowed || card.allowGameAction('bow', context))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to {2} {3}', this.controller, this, context.target.bowed ? 'unbow' : 'bow', context.target);
                if(context.target.bowed) {
                    this.game.applyGameAction(context, { ready: context.target });
                } else {
                    this.game.applyGameAction(context, { bow: context.target });
                }
            }
        });
    }
}

AgainstTheWaves.id = 'against-the-waves';

module.exports = AgainstTheWaves;
