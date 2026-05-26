const AgreementPrompt = require('./AgreementPrompt');

const RematchModes = {
    same: { description: 'with the same decks' },
    swap: { description: 'with swapped decks' },
    change: { description: 'with different decks' }
};

class RematchPrompt extends AgreementPrompt {
    /**
     * @param {string} mode 'same' (default), 'swap' (same decks, but swap
     * sides), or 'change' (each player picks a different deck).
     * @param {{onAccept?: () => void, onCancel?: () => void}} [callbacks]
     */
    constructor(game, requestingPlayer, mode = 'same', callbacks = {}) {
        super(game, requestingPlayer, callbacks);

        if (!RematchModes[mode]) {
            mode = 'same';
        }
        this.mode = mode;
    }

    getWaitingTitle() {
        return 'Waiting for opponent to accept a rematch';
    }

    getRequestMenuTitle() {
        return {
            text: '{{player}} would like a rematch {{description}}. Accept?',
            values: {
                player: this.requestingPlayer.name,
                description: RematchModes[this.mode].description
            }
        };
    }

    addCancelAlert(player) {
        this.game.addAlert('info', '{0} cancels their rematch request', player);
    }

    addAcceptAlert(player) {
        this.game.addAlert(
            'info',
            '{0} has agreed to a rematch {1}',
            player,
            RematchModes[this.mode].description
        );
    }

    addDeclineAlert(player) {
        this.game.addAlert('info', '{0} has declined a rematch', player);
    }

    onCompleted() {
        if (this.cancelled) {
            return;
        }

        this.game.rematch(this.mode);
        this.game.addAlert(
            'danger',
            '{0} resets the game and starts a rematch {1}',
            this.requestingPlayer,
            RematchModes[this.mode].description
        );
    }
}

module.exports = RematchPrompt;
