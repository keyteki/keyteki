const PlayerOrderPrompt = require('../playerorderprompt.js');

class EndRoundPrompt extends PlayerOrderPrompt {
    activePrompt() {
        return {
            menuTitle: '',
            buttons: [
                { command: 'menuButton', text: 'End Round' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to end the round' };
    }

    onMenuCommand(player) {
        if(player !== this.currentPlayer) {
            return false;
        }

        this.completePlayer();
    }
}

module.exports = EndRoundPrompt;
