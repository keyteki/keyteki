const AllPlayerPrompt = require('../allplayerprompt.js');

class MulliganPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.takenMulligan = {};
        this.mulliganedPlayers = [];
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
            this.mulliganedPlayers.push(player);
            this.takenMulligan[player.uuid] = true;
            return true;
        } else if (arg === 'yes') {
            this.takenMulligan[player.uuid] = true;
            return true;
        }

        return false;
    }

    onCompleted() {
        // Display a message for each player that mulliganed in player order
        if (this.mulliganedPlayers.includes(this.game.activePlayer)) {
            this.game.addMessage('{0} mulligans their starting hand', this.game.activePlayer);
        } else {
            this.game.addMessage('{0} keeps their starting hand', this.game.activePlayer);
        }

        const otherPlayer = this.game.getOtherPlayer(this.game.activePlayer);
        if (otherPlayer && this.mulliganedPlayers.includes(otherPlayer)) {
            this.game.addMessage('{0} mulligans their starting hand', otherPlayer);
        } else if (otherPlayer) {
            this.game.addMessage('{0} keeps their starting hand', otherPlayer);
        }
    }
}

module.exports = MulliganPrompt;
