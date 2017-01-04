const DrawCard = require('../../../drawcard.js');

class StarfallCavalry extends DrawCard {
    play(player) {
        super.play(player);

        if(player.phase !== 'marshal') {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Draw card(s)', method: 'trigger' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    trigger(player) {
        var numCards = player.plotDiscard.size() >= 3 ? 3 : 1;

        player.drawCardsToHand(numCards);

        this.game.addMessage('{0} uses {1} to draw {2} card{3}', player, this, numCards, numCards > 1 ? 's' : '');

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

StarfallCavalry.code = '04035';

module.exports = StarfallCavalry;
