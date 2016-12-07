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
                player.setPrompt(this.activePrompt());
            } else {
                player.setPrompt(this.waitingPrompt());
            }
        });
    }

    activeCondition(player) {
        return true;
    }

    activePrompt() {
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
