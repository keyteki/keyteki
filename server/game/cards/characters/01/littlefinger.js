const DrawCard = require('../../../drawcard.js');

class LittleFinger extends DrawCard {
    play(player) {
        super.play(player);

        if(player.phase !== 'marshal') {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Draw 2 Cards', method: 'trigger' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    trigger(player) {
        if(this.isBlank() || this.controller !== player) {
            return false;
        }

        player.drawCardsToHand(2);

        this.game.addMessage('{0} uses {1} to draw 2 cards', player, this);

        return true;
    }

    cancel(player) {
        if(this.isBlank() || this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }

    getIncome() {
        if(!this.isBlank()) {
            return 1;
        }
    }
}

LittleFinger.code = '01028';

module.exports = LittleFinger;
