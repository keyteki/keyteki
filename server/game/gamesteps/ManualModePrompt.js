const AllPlayerPrompt = require('./allplayerprompt');

class ManualModePrompt extends AllPlayerPrompt {
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
            menuTitle: {
                text: '{{player}} requests to enable manual mode. Allow?',
                values: { player: this.requestingPlayer.name }
            },
            buttons: [
                { arg: 'yes', text: 'Yes' },
                { arg: 'no', text: 'No' }
            ]
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to approve entering manual mode'
        };
    }

    onMenuCommand(player, arg) {
        if (arg === 'yes') {
            this.game.addAlert('info', '{0} allows enabling manual mode', player);
            this.completedPlayers.add(player);
        } else {
            this.game.addAlert('info', '{0} disallows enabling manual mode', player);
            this.cancelled = true;
        }

        return true;
    }

    onCompleted() {
        if (this.cancelled) {
            return;
        }

        this.game.addAlert('danger', '{0} switches manual mode on', this.requestingPlayer);
        this.game.manualMode = true;
    }
}

module.exports = ManualModePrompt;
