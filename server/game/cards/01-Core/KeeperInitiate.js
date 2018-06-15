const DrawCard = require('../../drawcard.js');

class KeeperInitiate extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put this into play',
            when: {
                onClaimRing: (event, context) => event.player === context.player && context.player.role &&
                                                 event.conflict.elements.some(element => context.player.role.hasTrait(element))
            },
            location: ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile'],
            gameAction: ability.actions.putIntoPlay(),
            then: {
                gameAction: ability.actions.placeFate()
            }
        });
    }
}

KeeperInitiate.id = 'keeper-initiate';

module.exports = KeeperInitiate;
