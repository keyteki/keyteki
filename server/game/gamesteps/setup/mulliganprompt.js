const AllPlayerPrompt = require('../allplayerprompt.js');

class MulliganPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.mulliganDecided = {}; // The state of whether or not a player has chosen to mulligan
        this.otherPlayerMulliganChoice = {}; // The mulligan choice of the other player for deferred logging
    }

    completionCondition(player) {
        return this.mulliganDecided[player.uuid];
    }

    activePrompt() {
        return {
            menuTitle: 'Keep Starting Hand?',
            buttons: [
                { arg: 'keep', text: 'Keep Hand' },
                { arg: 'mulligan', text: 'Mulligan' }
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
        if (this.mulliganDecided[player.uuid]) {
            return false;
        }

        if (arg !== 'keep' && arg !== 'mulligan') {
            return false;
        }

        // Log mulligan choice for first player and defer it for second player
        if (player === this.game.activePlayer) {
            this.logMulligan(player, arg);
        } else {
            this.otherPlayerMulliganChoice[player.uuid] = arg;
        }

        // Handle mulligan choice
        if (arg === 'mulligan') {
            player.takeMulligan();
        }

        this.mulliganDecided[player.uuid] = true;
        return true;
    }

    onCompleted() {
        const otherPlayer = this.game.getOtherPlayer(this.game.activePlayer);
        if (otherPlayer) {
            this.logMulligan(otherPlayer, this.otherPlayerMulliganChoice[otherPlayer.uuid]);
        }
    }

    logMulligan(player, arg) {
        if (arg === 'keep') {
            this.game.addMessage('{0} keeps their starting hand', player);
        }
        if (arg === 'mulligan') {
            this.game.addMessage('{0} mulligans their starting hand', player);
        }
    }
}

module.exports = MulliganPrompt;
