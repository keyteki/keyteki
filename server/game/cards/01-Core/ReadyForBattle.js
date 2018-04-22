const DrawCard = require('../../drawcard.js');

class ReadyForBattle extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character',
            when: {
                onCardBowed: (event, context) => event.card.controller === context.player && event.context && event.card.allowGameAction('ready', context) &&
                                                 (event.context.source.type === 'ring' || event.context.source.controller === context.player.opponent)
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
