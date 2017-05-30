const AllPlayerPrompt = require('../allplayerprompt.js');

class SetupProvincessPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return player.setupprovinces;
    }

    activePrompt() {
        return {
            menuTitle: 'Place provinces',
            buttons: [
                { arg: 'setupprovincesdone', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to finish placing provinces' };
    }

    onMenuCommand(player) {
        player.setupprovinces = true;
        this.game.addMessage('{0} has finished placing provinces', player);
    }
}

module.exports = SetupProvincesPrompt;