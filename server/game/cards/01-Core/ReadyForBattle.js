const DrawCard = require('../../drawcard.js');

class ReadyForBattle extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character',
            when: {
                onCardBowed: event => (event.card.bowed && event.card.controller === this.controller && event.context && 
                        (event.context.source.type === 'ring' || event.context.source.controller === this.controller.opponent))
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to ready {2}', this.controller, this, context.event.card);
                this.game.applyGameAction(context, { ready: context.event.card });
            }
        });
    }
}

ReadyForBattle.id = 'ready-for-battle';

module.exports = ReadyForBattle;
