const AllPlayerPrompt = require('../allplayerprompt.js');

class MulliganPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.takenMulligan = {};
    }

    completionCondition(player) {
        return this.takenMulligan[player.uuid];
    }

    activePrompt() {
        return {
            menuTitle: 'Keep Starting Hand?',
            buttons: [
                { arg: 'yes', text: 'Keep Hand' },
                { arg: 'no', text: 'Mulligan' }
            ],
            promptTitle: 'Mulligan'
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to mulligan cards'
        };
    }

    menuCommand(player, arg) {
        if (this.takenMulligan[player.uuid]) {
            return false;
        }

        if (arg === 'no') {
            player.takeMulligan();
            this.takenMulligan[player.uuid] = true;
            return true;
        } else if (arg === 'yes') {
            this.takenMulligan[player.uuid] = true;
            return true;
        }

        return false;
    }
}

module.exports = MulliganPrompt;
