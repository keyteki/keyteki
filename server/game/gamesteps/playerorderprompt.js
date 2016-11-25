const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');

/**
 * Represents a UI Prompt that prompts each player individually in first-player
 * order. Inheritors should call completePlayer() when the prompt for the
 * current player has been completed. Overriding skipCondition will exclude
 * any matching players from the prompt.
 */
class PlayerOrderPrompt extends UiPrompt {
    constructor(game) {
        super(game);
        this.players = game.getPlayersInFirstPlayerOrder();
    }

    get currentPlayer() {
        return this.players[0];
    }

    skipPlayers() {
        this.players = _.reject(this.players, p => this.skipCondition(p));
    }

    skipCondition(player) {
        return false;
    }

    completePlayer() {
        this.players.shift();
    }

    isComplete() {
        return this.players.length === 0;
    }

    activeCondition(player) {
        return player === this.currentPlayer;
    }

    continue() {
        this.skipPlayers();
        return super.continue();
    }
}

module.exports = PlayerOrderPrompt;
