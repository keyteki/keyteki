const DrawCard = require('../../drawcard.js');

class VoiceOfHonor extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onCardAbilityInitiated: (event, context) => event.card.type === 'event' && context.player.opponent && 
                                                            context.player.getNumberOfCardsInPlay(card => card.isHonored) > 
                                                            context.player.opponent.getNumberOfCardsInPlay(card => card.isHonored)
            },
            cannotBeMirrored: true,
            effect: 'cancel {1}',
            effectArgs: context => context.event.card,
            handler: context => context.cancel()
        });
    }
}

VoiceOfHonor.id = 'voice-of-honor';

module.exports = VoiceOfHonor;

