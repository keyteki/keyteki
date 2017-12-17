const DrawCard = require('../../drawcard.js');

class Censure extends DrawCard {
    setupCardAbilities() {        
        this.interrupt({
            title: 'Cancel an event',
            when: {
                onCardAbilityInitiated: event => event.card.type === 'event'
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} uses {1} to cancel {2}', this.controller, this, context.event.card);
                context.cancel();
            }
        });
    }

    canPlay() {
        if(this.controller.imperialFavor !== '') {
            return super.canPlay();
        }
        return false;
    }
}

Censure.id = 'censure';

module.exports = Censure;
