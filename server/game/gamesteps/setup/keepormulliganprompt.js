const AllPlayerPrompt = require('../allplayerprompt.js');

class KeepOrMulliganPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return player.readyToStart;
    }

    activePrompt() {
        return {
            menuTitle: 'Keep Starting Hand?',
            buttons: [
                { arg: 'keep', text: 'Keep Hand' },
                { arg: 'mulligan', text: 'Mulligan' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to keep hand or mulligan' };
    }

    onMenuCommand(player, arg) {
        if(arg === 'keep') {
            player.keep();
            this.game.addMessage('{0} has kept their hand', player);
        } else if(arg === 'mulligan' && player.mulligan()) {
            this.game.addMessage('{0} has taken a mulligan', player);
        }
    }
}

module.exports = KeepOrMulliganPrompt;
