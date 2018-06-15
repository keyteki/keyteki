const DrawCard = require('../../drawcard.js');

class Censure extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onCardAbilityInitiated: event => event.card.type === 'event'
            },
            cannotBeMirrored: true,
            effect: 'cancel {1}',
            effectArgs: context => context.event.card,
            handler: context => context.cancel()
        });
    }

    canPlay(context) {
        if(this.controller.imperialFavor !== '') {
            return super.canPlay(context);
        }
        return false;
    }
}

Censure.id = 'censure';

module.exports = Censure;
