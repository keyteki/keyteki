const DrawCard = require('../../../drawcard.js');

class Lannisport extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.challengeType === 'intrigue' && challenge.winner === this.controller
            },
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
            }
        });
    }
}

Lannisport.code = '01098';

module.exports = Lannisport;
