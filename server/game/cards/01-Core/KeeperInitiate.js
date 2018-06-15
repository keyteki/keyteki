const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class KeeperInitiate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put this into play',
            when: {
                onClaimRing: (event, context) => (
                    event.player === context.player && !context.source.facedown && context.player.role && 
                    _.any(event.conflict.getElements(), element => context.player.role.hasTrait(element)) && 
                    context.source.location !== 'play area' && context.source.allowGameAction('putIntoPlay', context)
                )
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
