const DrawCard = require('../../drawcard.js');

class AkodoToturi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: event => (event.conflict && event.conflict.isParticipating(this) && 
                        event.conflict.conflictType === 'military' && event.player === this.controller)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to resolve the ring\'s effect again', this.controller, this);
                context.event.conflict.resolveRingEffects();
            }
        });
    }
}

AkodoToturi.id = 'akodo-toturi';

module.exports = AkodoToturi;
