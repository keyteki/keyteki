const _ = require('underscore');
const BaseStep = require('./basestep.js');
const uuid = require('uuid');

class UiPrompt extends BaseStep {
    constructor(game) {
        super(game);
        this.completed = false;
        this.uuid = uuid.v1();
    }

    isComplete() {
        return this.completed;
    }

    complete() {
        this.completed = true;
    }

    setPrompt() {
        _.each(this.game.getPlayers(), (player) => {
            if (this.activeCondition(player)) {
                player.setPrompt(this.addDefaultCommandToButtons(this.activePrompt(player)));
                player.startClock();
            } else {
                player.setPrompt(this.waitingPrompt());
            }
        });
    }

    activeCondition(player) {
        return player === this.game.activePlayer;
    }

    // eslint-disable-next-line no-unused-vars
    activePrompt(player) {}

    addDefaultCommandToButtons(original) {
        var prompt = _.clone(original);
        if (prompt.buttons) {
            _.each(prompt.buttons, (button) => {
                button.command = button.command || 'menuButton';
                button.uuid = this.uuid;
            });
        }

        if (prompt.controls) {
            for (let control of prompt.controls) {
                control.uuid = this.uuid;
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
        _.each(this.game.getPlayers(), (player) => {
            player.cancelPrompt();
        });
    }

    onMenuCommand(player, arg, uuid, method) {
        if (!this.activeCondition(player) || uuid !== this.uuid) {
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
