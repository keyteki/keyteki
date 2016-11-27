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
        this.saveOriginalPrompts();
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
        this.restoreOriginalPrompts();
    }

    // TODO: Saving and restoring prompts shouldn't be necessary once the full
    //       game is converted into steps + prompts.
    saveOriginalPrompts() {
        if(this.originalPrompts) {
            return;
        }

        this.originalPrompts = _.map(this.game.getPlayers(), player => {
            return {
                player: player,
                prompt: player.currentPrompt()
            };
        });
    }

    restoreOriginalPrompts() {
        if(this.originalPrompts) {
            _.each(this.originalPrompts, originalPrompt => {
                originalPrompt.player.setPrompt(originalPrompt.prompt);
            });
        }
    }
}

module.exports = UiPrompt;
