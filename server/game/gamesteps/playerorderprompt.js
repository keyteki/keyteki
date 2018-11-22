const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');

/**
 * Represents a UI Prompt that prompts each player individually in first-player
 * order. Inheritors should call completePlayer() when the prompt for the
 * current player has been completed. Overriding skipCondition will exclude
 * any matching players from the prompt.
 */
class PlayerOrderPrompt extends UiPrompt {
    get currentPlayer() {
        this.lazyFetchPlayers();
        return this.players[0];
    }

    lazyFetchPlayers() {
        if(!this.players) {
            this.players = this.game.getPlayersInFirstPlayerOrder();
        }
    }

    skipPlayers() {
        this.lazyFetchPlayers();
        this.players = _.reject(this.players, p => this.skipCondition(p));
    }

    skipCondition(player) { // eslint-disable-line no-unused-vars
        return false;
    }

    completePlayer() {
        this.lazyFetchPlayers();
        this.players.shift();
    }

    setPlayers(players) {
        this.players = players;
    }

    isComplete() {
        this.lazyFetchPlayers();
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
