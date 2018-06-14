const DrawCard = require('../../drawcard.js');

class DojiHotaru extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: (event, context) => this.game.isDuringConflict('political') && context.source.isParticipating() && 
                                                 event.player === context.player
            },
            gameAction: ability.actions.resolveRing({ attackingPlayer: false })
        });
    }
}

DojiHotaru.id = 'doji-hotaru';

module.exports = DojiHotaru;
