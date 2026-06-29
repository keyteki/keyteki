const UiPrompt = require('./uiprompt.js');

class AllPlayerPrompt extends UiPrompt {
    activeCondition(player) {
        return !this.completionCondition(player);
    }

    // eslint-disable-next-line no-unused-vars
    completionCondition(player) {
        return false;
    }

    isComplete() {
        return this.game.getPlayers().every((player) => {
            return this.completionCondition(player);
        });
    }
}

module.exports = AllPlayerPrompt;
