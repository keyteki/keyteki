const _ = require('underscore');
const BaseStep = require('./basestep.js');

class UiPrompt extends BaseStep {
    constructor(game) {
        super(game);
        this.completed = false;
    }

    isComplete() {
        return this.completed;
    }

    complete() {
        this.completed = true;
    }

    setPrompt() {
        _.each(this.game.getPlayers(), player => {
            if(this.activeCondition(player)) {
                player.setPrompt(this.addDefaultCommandToButtons(this.activePrompt()));
            } else {
                player.setPrompt(this.waitingPrompt());
            }
        });
    }

    activeCondition() {
        return true;
    }

    activePrompt() {
    }

    addDefaultCommandToButtons(original) {
        var prompt = _.clone(original);
        if(prompt.buttons) {
            _.each(prompt.buttons, button => {
                button.command = button.command || 'menuButton';
            });
        }
        return prompt;
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent' };
    }

    continue() {
        var completed = this.isComplete();

        if(completed) {
            this.clearPrompts();
        } else {
            this.setPrompt();
        }

        return completed;
    }

    clearPrompts() {
        _.each(this.game.getPlayers(), player => {
            player.cancelPrompt();
        });
    }
}

module.exports = UiPrompt;
