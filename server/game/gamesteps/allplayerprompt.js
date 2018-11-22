const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');

class AllPlayerPrompt extends UiPrompt {
    activeCondition(player) {
        return !this.completionCondition(player);
    }

    completionCondition(player) { // eslint-disable-line no-unused-vars
        return false;
    }

    isComplete() {
        return _.all(this.game.getPlayers(), player => {
            return this.completionCondition(player);
        });
    }
}

module.exports = AllPlayerPrompt;
