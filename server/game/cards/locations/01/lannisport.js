const DrawCard = require('../../../drawcard.js');

class Lannisport extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    onBeginRound() {
        this.abilityUsed = 0;
    }

    afterChallenge(event, challengeType, winner) {
        if(!this.inPlay || this.isBlank()) {
            return;
        }

        if(challengeType !== 'intrigue' || winner !== this.owner) {
            return;
        }

        this.game.promptWithMenu(winner, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Draw 1 card', command: 'menuButton', method: 'drawCard' },
                    { text: 'No', command: 'menuButton', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to perform reactions'
        });
    }

    drawCard(player) {
        if(!this.inPlay || this.isBlank() || this.owner !== player) {
            return false;
        }

        player.drawCardsToHand(1);

        this.game.addMessage('{0} uses {1} to draw 1 card', player, this);

        return true;
    }

    cancel(player) {
        if(!this.inPlay || this.isBlank() || this.owner !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }
}

Lannisport.code = '01098';

module.exports = Lannisport;
