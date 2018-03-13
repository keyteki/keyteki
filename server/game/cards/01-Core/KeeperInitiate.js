const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class KeeperInitiate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put this into play',
            when: {
                onClaimRing: event => (event.player === this.controller && this.controller.role && 
                        _.any(event.conflict.getElements(), element => this.controller.role.hasTrait(element)) && !this.facedown && 
                        this.location !== 'play area') // TODO: this needs allowGameAction when a context reference is available
            },
            location: ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile'],
            handler: context => {
                this.game.addMessage('{0} puts {1} into play from their {2}', this.controller, this, this.location === 'dynasty discard pile' ? 'discard pile' : 'province');
                let event = this.game.applyGameAction(context, { putIntoPlay: this })[0];
                event.addThenGameAction(context, { placeFate: this });
            }
        });
    }
}

KeeperInitiate.id = 'keeper-initiate';

module.exports = KeeperInitiate;
