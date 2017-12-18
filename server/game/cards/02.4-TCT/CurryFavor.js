const DrawCard = require('../../drawcard.js');

class CurryFavor extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character',
            when: {
                onReturnHome: event => event.conflict.attackingPlayer && event.conflict.attackingPlayer === this.controller && 
                                       event.conflict.attackingPlayer.conflicts.complete === 2 && !event.bowedPreReturn && event.card.allowGameAction('ready')
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to ready {2}', this.controller, this, context.event.card);
                this.controller.readyCard(context.event.card, this);
            }
        });
    }
}

CurryFavor.id = 'curry-favor';

module.exports = CurryFavor;
