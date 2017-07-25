const UiPrompt = require('../uiprompt.js');

class DrawBidPrompt extends UiPrompt {
    constructor(game, player) {
        super(game);
        this.player = player;
    }

    activeCondition(player) {
        return this.player === player;
    }

    activePrompt() {
        return {
            menuTitle: 'Choose a bid',
            buttons: [
                { text: '1', arg: '1' },
                { text: '2', arg: '2' },
                { text: '3', arg: '3' },
                { text: '4', arg: '4' },
                { text: '5', arg: '5' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose a bid.' };
    }

    onMenuCommand(player, bid) {
        if(this.player !== player) {
            return false;
        }

        this.game.addMessage('{0} has chosen a bid.', player);

        this.player.setDrawBid(bid);

        this.complete();
    }
}

module.exports = DrawBidPrompt;
