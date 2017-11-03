const DrawCard = require('../../drawcard.js');

class KeeperInitiate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put this into play',
            when: {
                onClaimRing: event => (event.player === this.controller && this.controller.role && 
                        this.controller.role.hasTrait(event.conflict.conflictRing) && !this.facedown && 
                        this.location !== 'play area' && this.controller.canPutIntoPlay(this))
            },
            location: ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile'],
            handler: () => {
                this.game.addMessage('{0} puts {1} into play from his {2}', this.controller, this, this.location === 'dynasty dicard pile' ? 'discard pile' : 'province');
                this.controller.putIntoPlay(this);
                this.modifyFate(1);
            }
        });
    }
}

KeeperInitiate.id = 'keeper-initiate';

module.exports = KeeperInitiate;
