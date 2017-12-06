const DrawCard = require('../../drawcard.js');

class DojiHotaru extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: event => (event.conflict && event.conflict.isParticipating(this) && 
                        event.conflict.conflictType === 'political' && event.player === this.controller)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to resolve the ring\'s effect again', this.controller, this);
                context.event.conflict.chooseWhetherToResolveRingEffect(context.event.conflict.attackingPlayer, false);
            }
        });
    }
}

DojiHotaru.id = 'doji-hotaru';

module.exports = DojiHotaru;
