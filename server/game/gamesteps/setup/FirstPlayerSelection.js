const AllPlayerPrompt = require('../allplayerprompt');
const _ = require('underscore');

class FirstPlayerSelection extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.previousWinner = game.previousWinner;
        this.clickedButton = false;
        this.players = game.getPlayers();
    }

    completionCondition(player) {
        return this.previousWinner === player.name || !this.previousWinner || this.clickedButton;
    }

    activePrompt() {
        return {
            promptTitle: 'First Player',
            menuTitle: 'Who will go first?',
            buttons: this.players
                .map((player) => ({ arg: player.name, text: player.name }))
                .concat({ arg: 'random', text: 'random' })
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose to continue who will go first' };
    }

    menuCommand(player, arg) {
        const otherPlayer = this.game.getOtherPlayer(player);
        let message;

        if (!otherPlayer) {
            this.game.activePlayer = player;
            message = '{0} will go first';
        } else if (arg === player.name) {
            this.game.activePlayer = player;
            message = '{0} chooses to go first';
        } else if (arg === otherPlayer.name) {
            this.game.activePlayer = otherPlayer;
            message = '{0} chooses to go second';
        } else {
            message = '{0} chooses to randomize the first player';
        }

        this.game.addMessage(message, player.name);

        this.clickedButton = true;

        return true;
    }

    onCompleted() {
        if (!this.game.activePlayer) {
            let allPlayersShuffled = _.shuffle(this.game.getPlayers());
            this.game.activePlayer = allPlayersShuffled.shift();
            this.game.addMessage('{0} won the flip and is first player', this.game.activePlayer);
        }
    }
}

module.exports = FirstPlayerSelection;
