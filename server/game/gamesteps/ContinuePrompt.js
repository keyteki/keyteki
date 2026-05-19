const AllPlayerPrompt = require('./allplayerprompt');

class ContinuePrompt extends AllPlayerPrompt {
    /**
     * @param {{onAccept?: () => void, onCancel?: () => void}} [callbacks]
     */
    constructor(game, requestingPlayer, callbacks = {}) {
        super(game);

        this.requestingPlayer = requestingPlayer;
        this.completedPlayers = new Set([requestingPlayer]);
        this.cancelled = false;
        this.callbacks = callbacks;
    }

    completionCondition(player) {
        return this.cancelled || this.completedPlayers.has(player);
    }

    activeCondition(player) {
        // Keep the requesting player active so they can see a Back button to
        // cancel the request if they clicked the wrong option.
        if (this.cancelled) {
            return false;
        }
        return player === this.requestingPlayer || !this.completedPlayers.has(player);
    }

    activePrompt(player) {
        if (player === this.requestingPlayer) {
            return {
                menuTitle: 'Waiting for opponent to agree to continue',
                buttons: [{ arg: 'back', text: 'Back' }]
            };
        }
        return {
            menuTitle: {
                text: '{{player}} would like to continue playing. Allow?',
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
            menuTitle: 'Waiting for opponent to agree to continue'
        };
    }

    onMenuCommand(player, arg) {
        if (arg === 'back' && player === this.requestingPlayer) {
            this.game.addAlert('info', '{0} cancels their continue request', player);
            this.cancelled = true;
            this.callbacks.onCancel?.();
            return true;
        }

        if (arg === 'yes') {
            this.game.addAlert('info', '{0} agrees to continue playing', player);
            this.completedPlayers.add(player);
            this.callbacks.onAccept?.();
        } else {
            this.game.addAlert('info', '{0} would not like to continue playing', player);
            this.cancelled = true;
            this.callbacks.onCancel?.();
        }

        return true;
    }
}

module.exports = ContinuePrompt;
