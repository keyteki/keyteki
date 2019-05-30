const AllPlayerPrompt = require('./allplayerprompt');

class RematchPrompt extends AllPlayerPrompt {
    constructor(game, requestingPlayer) {
        super(game);

        this.requestingPlayer = requestingPlayer;
        this.completedPlayers = new Set([requestingPlayer]);
        this.cancelled = false;
    }

    completionCondition(player) {
        return this.cancelled || this.completedPlayers.has(player);
    }

    activePrompt() {
        return {
            menuTitle: `${this.requestingPlayer.name} would like a rematch. Allow?`,
            buttons: [
                { arg: 'yes', text: 'Yes' },
                { arg: 'no', text: 'No' }
            ]
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to agree to rematch'
        };
    }

    onMenuCommand(player, arg) {
        if(arg === 'yes') {
            this.game.addAlert('info', '{0} agrees to a rematch, setting it up now', player);
            this.completedPlayers.add(player);
        } else {
            this.game.addAlert('info', '{0} would not like a rematch', player);
            this.cancelled = true;
        }

        return true;
    }

    onCompleted() {
        if(this.cancelled) {
            return;
        }

        this.game.rematch();
        this.game.addAlert('danger', '{0} uses /rematch to reset the game and start a rematch', this.requestingPlayer);
    }
}

module.exports = RematchPrompt;
