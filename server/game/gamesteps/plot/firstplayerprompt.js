const _ = require('underscore');

const UIPrompt = require('../uiprompt.js');

class FirstPlayerPrompt extends UIPrompt {
    constructor(game, player) {
        super(game);

        this.player = player;
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        return {
            menuTitle: 'Select first player',
            buttons: _.map(this.getFirstPlayerChoices(), player => {
                return { text: player.name, arg: player.name };
            })
        };
    }

    getFirstPlayerChoices() {
        let opponents = _.reject(this.game.getPlayers(), player => player === this.player);
        let firstPlayerChoices = [this.player].concat(opponents);
        return _.filter(firstPlayerChoices, player => this.player.canSelectAsFirstPlayer(player));
    }

    onMenuCommand(player, playerName) {
        if(player !== this.player) {
            return false;
        }

        var firstPlayer = this.game.getPlayerByName(playerName);
        if(!firstPlayer) {
            return;
        }

        _.each(this.game.getPlayers(), player => {
            player.firstPlayer = firstPlayer === player;
        });

        this.game.addMessage('{0} has selected {1} to be the first player', player, firstPlayer);
        this.game.raiseEvent('onFirstPlayerDetermined', firstPlayer);

        this.complete();
    }
}

module.exports = FirstPlayerPrompt;
