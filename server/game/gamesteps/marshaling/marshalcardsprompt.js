const UiPrompt = require('../uiprompt.js');

class MarshalCardsPrompt extends UiPrompt {
    constructor(game, player) {
        super(game);
        this.player = player;
    }

    activeCondition(player) {
        return this.player === player;
    }

    activePrompt() {
        return {
            menuTitle: 'Marshal your cards',
            buttons: [
                { text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to finish marshalling' };
    }

    onMenuCommand(player) {
        if(this.player !== player) {
            return false;
        }

        this.game.addMessage('{0} has finished marshalling', player);
        this.complete();
    }
}

module.exports = MarshalCardsPrompt;
