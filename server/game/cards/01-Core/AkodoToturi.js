const DrawCard = require('../../drawcard.js');

class AkodoToturi extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: (event, context) => this.game.isDuringConflict('military') && context.source.isParticipating() &&
                                                 event.player === context.player
            },
            gameAction: ability.actions.resolveRing({ attackingPlayer: false })
        });
    }
}

AkodoToturi.id = 'akodo-toturi';

module.exports = AkodoToturi;
