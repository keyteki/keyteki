const UiPrompt = require('./uiprompt');

/**
 * Presented to the waiting player when the active player has been inactive
 * for the configured threshold. Allows the waiting player to force-pass
 * the idle player's turn (cancelling all pending prompts and ending the round).
 */
class ForcePassTurnPrompt extends UiPrompt {
    constructor(game, waitingPlayer, idlePlayer) {
        super(game);
        this.waitingPlayer = waitingPlayer;
        this.idlePlayer = idlePlayer;
    }

    activeCondition(player) {
        return player === this.waitingPlayer;
    }

    activePrompt() {
        return {
            promptTitle: 'Opponent Inactive',
            menuTitle: {
                text: '{{player}} has been inactive. You may force them to pass their turn.',
                values: { player: this.idlePlayer.name }
            },
            buttons: [
                { arg: 'force-pass', text: 'Force Pass Turn' },
                { arg: 'cancel', text: 'Wait' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent' };
    }

    onMenuCommand(player, arg) {
        if (player !== this.waitingPlayer) {
            return false;
        }

        if (arg === 'force-pass') {
            this.game.addAlert(
                'warning',
                '{0} forces {1} to pass their turn due to inactivity',
                this.waitingPlayer,
                this.idlePlayer
            );

            this.game.forcePassCount++;
            this.game.forcePassTurn();
            this.complete();
            return true;
        }

        if (arg === 'cancel') {
            this.complete();
            return true;
        }

        return false;
    }
}

module.exports = ForcePassTurnPrompt;
