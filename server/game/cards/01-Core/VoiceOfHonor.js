const DrawCard = require('../../drawcard.js');

class VoiceOfHonor extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Cancel an event',
            when: {
                onCardAbilityInitiated: event => event.card.type === 'event' && this.controller.opponent && this.controller.getNumberOfCardsInPlay(card => card.isHonored) > this.controller.opponent.getNumberOfCardsInPlay(card => card.isHonored)
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} uses {1} to cancel {2}', this.controller, this, context.event.card);
                context.cancel();
            }
        });
    }
}

VoiceOfHonor.id = 'voice-of-honor';

module.exports = VoiceOfHonor;

