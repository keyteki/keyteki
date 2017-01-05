const DrawCard = require('../../../drawcard.js');

class TheHound extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(event, challenge) {
        if(challenge.winner !== this.controller || this.isBlank()) {
            return;
        }

        if(!challenge.isParticipating(this)) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Discard 1 card at random for ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'discardCard' },
                    { text: 'No', method: 'returnToHand' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    discardCard(player) {
        this.game.addMessage('{0} is forced to discard a card to keep {1} in play', player, this);

        player.discardAtRandom(1);

        return true;
    }

    returnToHand(player) {
        this.game.addMessage('{0} is forced to return {1} to their hand', player, this);

        player.moveCard(this, 'hand');

        return true;
    }
}

TheHound.code = '02009';

module.exports = TheHound;
