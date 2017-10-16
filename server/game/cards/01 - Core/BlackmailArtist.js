const DrawCard = require('../../drawcard.js');

class BlackmailArtist extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterConflict: event => event.conflict.isParticipating(this) && event.conflict.winner === this.controller && this.controller.opponent
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to make {2} lose one honor after losing the conflict', this.controller, this, context.event.conflict.loser);
                this.game.addHonor(context.event.conflict.loser, -1);
            }
        });
    }
}

BlackmailArtist.id = 'blackmail-artist';

module.exports = BlackmailArtist;
