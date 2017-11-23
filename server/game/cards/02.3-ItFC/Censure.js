const DrawCard = require('../../drawcard.js');

class Censure extends DrawCard {
    setupCardAbilities() {        
        this.interrupt({
            title: 'Cancel an event',
            when: {
                onCardAbilityInitiated: event => event.card.type === 'event' && this.controller.imperialFavor !== ''
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} uses {1} to cancel {2}', this.controller, this, context.event.card);
                context.cancel();
            }
        });
    }
}

Censure.id = 'censure';

module.exports = Censure;
