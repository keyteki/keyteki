const DrawCard = require('../../../drawcard.js');

class Lannisport extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    onBeginRound() {
        this.abilityUsed = 0;
    }

    afterChallenge(event, challenge) {
        if(!this.inPlay || this.isBlank()) {
            return;
        }

        if(challenge.challengeType !== 'intrigue' || challenge.winner !== this.controller) {
            return;
        }

        this.game.promptWithMenu(challenge.winner, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Draw 1 card', method: 'drawCard' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to perform reactions'
        });
    }

    drawCard(player) {
        if(!this.inPlay || this.isBlank() || this.controller !== player) {
            return false;
        }

        player.drawCardsToHand(1);

        this.game.addMessage('{0} uses {1} to draw 1 card', player, this);

        return true;
    }

    cancel(player) {
        if(!this.inPlay || this.isBlank() || this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }
}

Lannisport.code = '01098';

module.exports = Lannisport;
