const DrawCard = require('../../drawcard.js');

class BlackmailArtist extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Take 1 honor',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.player &&
                                                   context.player.opponent && event.conflict.conflictType === 'political'
            },
            gameAction: ability.actions.takeHonor()
        });
    }
}

BlackmailArtist.id = 'blackmail-artist';

module.exports = BlackmailArtist;
