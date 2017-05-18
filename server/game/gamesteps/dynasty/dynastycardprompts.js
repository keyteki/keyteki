const UiPrompt = require('../uiprompt.js');

class DynastyCardsPrompt extends UiPrompt {
    constructor(game, player) {
        super(game);
        this.player = player;
    }

    activeCondition(player) {
        return this.player === player;
    }

    activePrompt() {
        return {
            menuTitle: 'Take an action',
            buttons: [
                { text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to take an action' };
    }

    onMenuCommand(player) {
        if(this.player !== player) {
            return false;
        }

        this.game.addMessage('{0} has taken an action', player);
        this.complete();
    }
}

module.exports = DynastyCardsPrompt;