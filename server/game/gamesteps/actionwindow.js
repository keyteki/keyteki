const PlayerOrderPrompt = require('./playerorderprompt.js');

class ActionWindow extends PlayerOrderPrompt {
    constructor(game, title, windowName) {
        super(game);

        this.title = title;
        this.windowName = windowName;
    }

    continue() {
        let completed = super.continue();

        if(!completed) {
            this.game.currentActionWindow = this;
        } else {
            this.game.currentActionWindow = null;
        }

        return completed;
    }

    activePrompt() {
        return {
            menuTitle: 'Initiate an action',
            buttons: [
                { text: 'Pass' }
            ],
            promptTitle: this.title
        };
    }

    skipCondition(player) {
        return !this.forceWindow && !player.promptedActionWindows[this.windowName];
    }

    onMenuCommand(player) {
        if(this.currentPlayer !== player) {
            return false;
        }

        this.completePlayer();

        return true;
    }

    markActionAsTaken() {
        this.setPlayers(this.rotatedPlayerOrder(this.currentPlayer));
        this.forceWindow = true;
    }

    rotatedPlayerOrder(player) {
        var players = this.game.getPlayersInFirstPlayerOrder();
        var splitIndex = players.indexOf(player);
        var beforePlayer = players.slice(0, splitIndex);
        var afterPlayer = players.slice(splitIndex + 1);
        return afterPlayer.concat(beforePlayer).concat([player]);
    }
}

module.exports = ActionWindow;
