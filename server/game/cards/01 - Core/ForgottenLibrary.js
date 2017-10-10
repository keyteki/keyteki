const DrawCard = require('../../drawcard.js');

class ForgottenLibrary extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: event => event.phase === 'draw'
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to draw a card', this.controller, this);
                this.controller.drawCardsToHand(1);
            }
        });
    }
}

ForgottenLibrary.id = 'forgotten-library';

module.exports = ForgottenLibrary;
