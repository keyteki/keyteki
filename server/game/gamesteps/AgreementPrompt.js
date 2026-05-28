const AllPlayerPrompt = require('./allplayerprompt');

/**
 * Shared base for two-player "ask the opponent to agree to X" prompts
 * (continue past a soft win, rematch, etc.). Subclasses customize the
 * prompt copy via the abstract hooks; the request/cancel/accept/decline
 * flow is handled here so a fix to it only needs to land in one place.
 *
 * @abstract
 */
class AgreementPrompt extends AllPlayerPrompt {
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
        if (player.left) {
            if (!this.cancelled) {
                this.cancelled = true;
                this.callbacks.onCancel?.();
            }
            return true;
        }
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
                menuTitle: this.getWaitingTitle(),
                buttons: [{ arg: 'back', text: 'Back' }]
            };
        }
        return {
            menuTitle: this.getRequestMenuTitle(),
            buttons: [
                { arg: 'yes', text: 'Yes' },
                { arg: 'no', text: 'No' }
            ]
        };
    }

    waitingPrompt() {
        return {
            menuTitle: this.getWaitingTitle()
        };
    }

    onMenuCommand(player, arg) {
        if (arg === 'back' && player === this.requestingPlayer) {
            this.addCancelAlert(player);
            this.cancelled = true;
            this.callbacks.onCancel?.();
            return true;
        }

        if (arg === 'yes') {
            this.addAcceptAlert(player);
            this.completedPlayers.add(player);
            this.callbacks.onAccept?.();
        } else {
            this.addDeclineAlert(player);
            this.cancelled = true;
            this.callbacks.onCancel?.();
        }

        return true;
    }

    /* --- abstract hooks --- */

    /** Title shown to the requester while waiting, and in waitingPrompt(). */
    getWaitingTitle() {
        throw new Error('getWaitingTitle() not implemented');
    }

    /** menuTitle object presented to the opponent being asked. */
    getRequestMenuTitle() {
        throw new Error('getRequestMenuTitle() not implemented');
    }

    /** Alert when the requester clicks Back. */
    addCancelAlert() {
        throw new Error('addCancelAlert() not implemented');
    }

    /** Alert when the opponent agrees. */
    addAcceptAlert() {
        throw new Error('addAcceptAlert() not implemented');
    }

    /** Alert when the opponent declines. */
    addDeclineAlert() {
        throw new Error('addDeclineAlert() not implemented');
    }
}

module.exports = AgreementPrompt;
