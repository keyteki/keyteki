const DrawCard = require('../../drawcard.js');

class BlackmailArtist extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Take 1 honor',
            when: {
                afterConflict: event => event.conflict.isParticipating(this) && event.conflict.winner === this.controller && this.controller.opponent
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to make {2} lose one honor after losing the conflict', this.controller, this, this.controller.opponent);
                this.game.transferHonor(this.controller.opponent, this.controller, -1);
            }
        });
    }
}

BlackmailArtist.id = 'blackmail-artist';

module.exports = BlackmailArtist;
