const DrawCard = require('../../drawcard.js');

class AkodoToturi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onClaimRing: event => event.conflict && event.conflict.isParticipating(this) && event.conflict.conflictType === 'military'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to resolve the ring\'s effect again', this.controller, this);
                context.event.conflict.winner.resolveRingEffects(context.event.conflict.conflictRing);
            }
        });
    }
}

AkodoToturi.id = 'akodo-toturi';

module.exports = AkodoToturi;
