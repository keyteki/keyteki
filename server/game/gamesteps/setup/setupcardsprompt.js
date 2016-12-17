const AllPlayerPrompt = require('../allplayerprompt.js');

class SetupCardsPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return player.setup;
    }

    activePrompt() {
        return {
            menuTitle: 'Select setup cards',
            buttons: [
                { arg: 'setupdone', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to finish setup' };
    }

    onMenuCommand(player) {
        player.setup = true;
        this.game.addMessage('{0} has finished setup', player);
    }
}

module.exports = SetupCardsPrompt;
