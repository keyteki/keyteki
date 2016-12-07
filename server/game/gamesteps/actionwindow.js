const PlayerOrderPrompt = require('./playerorderprompt.js');

class ActionWindow extends PlayerOrderPrompt {
    activePrompt() {
        return {
            menuTitle: 'Any actions or reactions?',
            buttons: [
                { command: 'menuButton', text: 'Done' }
            ]
        };
    }

    onMenuCommand(player) {
        if(this.currentPlayer !== player) {
            return false;
        }

        if(this.tookAction) {
            this.setPlayers(this.rotatedPlayerOrder(this.currentPlayer));
        } else {
            this.completePlayer();
        }

        this.tookAction = false;

        return true;
    }

    onCardClicked() {
        // For now, assume ANY card click means that the player has taken an
        // action and re-prompt all players in rotated first player order.
        this.tookAction = true;

        return false;
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
