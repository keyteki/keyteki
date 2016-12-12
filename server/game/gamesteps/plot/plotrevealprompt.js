const UIPrompt = require('../uiprompt.js');

class PlotRevealPrompt extends UIPrompt {
    constructor(game, player) {
        super(game);

        this.player = player;
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        var otherPlayer = this.game.getOtherPlayer(this.player);

        return {
            menuTitle: 'Select first player',
            buttons: [
                { text: this.player.name, command: 'menuButton', arg: this.player.id },
                { text: otherPlayer.name, command: 'menuButton', arg: otherPlayer.id }
            ]
        };
    }

    onMenuCommand(player, playerId) {
        if(player !== this.player) {
            return false;
        }

        var firstPlayer = this.game.getPlayerById(playerId);
        if(!firstPlayer) {
            return;
        }

        firstPlayer.firstPlayer = true;
        var otherPlayer = this.game.getOtherPlayer(firstPlayer);
        if(otherPlayer) {
            otherPlayer.firstPlayer = false;
        }

        this.game.addMessage('{0} has selected {1} to be the first player', player, firstPlayer);
    }

    continue() {
        this.setPrompt();

        return false;
    }
}

module.exports = PlotRevealPrompt;
