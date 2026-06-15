const BaseStep = require('./basestep.js');
const { randomUUID } = require('node:crypto');

class UiPrompt extends BaseStep {
    constructor(game) {
        super(game);
        this.completed = false;
        this.uuid = randomUUID();
    }

    isComplete() {
        return this.completed;
    }

    complete() {
        this.completed = true;
    }

    setPrompt() {
        for (const player of this.game.getPlayers()) {
            if (this.activeCondition(player)) {
                player.setPrompt(this.addDefaultCommandToButtons(this.activePrompt(player)));
                player.startClock();
            } else {
                player.setPrompt(this.waitingPrompt());
            }
        }
    }

    activeCondition(player) {
        return player === this.game.activePlayer;
    }

    // eslint-disable-next-line no-unused-vars
    activePrompt(player) {}

    addDefaultCommandToButtons(original) {
        var prompt = { ...original };
        if (prompt.buttons) {
            for (const button of prompt.buttons) {
                button.command = button.command || 'menuButton';
                button.uuid = this.uuid;
            }
        }

        if (prompt.controls) {
            for (let [index, control] of prompt.controls.entries()) {
                control.uuid = `${this.uuid}:${index}`;
            }
        }

        return prompt;
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent' };
    }

    continue() {
        var completed = this.isComplete();

        if (completed) {
            this.clearPrompts();
            this.onCompleted();
        } else {
            this.setPrompt();
        }

        return completed;
    }

    clearPrompts() {
        for (const player of this.game.getPlayers()) {
            player.cancelPrompt();
        }
    }

    onMenuCommand(player, arg, uuid, method) {
        if (
            !this.activeCondition(player) ||
            (uuid !== this.uuid && !(typeof uuid === 'string' && uuid.startsWith(`${this.uuid}:`)))
        ) {
            return false;
        }

        return this.menuCommand(player, arg, method);
    }

    // eslint-disable-next-line no-unused-vars
    menuCommand(player, arg, method) {
        return true;
    }

    /**
     * Handler that will be called once isComplete() returns true.
     */
    onCompleted() {}
}

module.exports = UiPrompt;
