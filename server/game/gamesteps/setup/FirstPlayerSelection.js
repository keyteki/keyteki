const AllPlayerPrompt = require('../allplayerprompt');
const _ = require('underscore');

class FirstPlayerSelection extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.previousWinner = game.previousWinner;
        this.clickedButton = false;
    }

    completionCondition(player) {
        return this.previousWinner === player.name || !this.previousWinner || this.clickedButton;
    }

    activePrompt() {
        return {
            promptTitle: 'First Player',
            menuTitle: 'Who will go first?',
            buttons: [
                { arg: 'me', text: 'Me' },
                { arg: 'opponent', text: 'Opponent' },
                { arg: 'random', text: 'random' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose to continue who will go first' };
    }

    menuCommand(player, arg) {
        switch(arg) {
            case 'me':
                this.game.activePlayer = player;
                this.game.addMessage('{0} chooses to go first.', player.name);
                break;
            case 'opponent':
                this.game.activePlayer = this.game.getOtherPlayer(player);
                this.game.addMessage('{0} chooses to go second.', player.name);
                break;
            default:
                this.game.addMessage('{0} chooses to randomize the first player.', player.name);
                break;
        }

        this.clickedButton = true;

        return true;
    }

    onCompleted() {
        if(!this.game.activePlayer) {
            let allPlayersShuffled = _.shuffle(this.game.getPlayers());
            this.game.activePlayer = allPlayersShuffled.shift();
            this.game.addMessage('{0} won the flip and is first player.',this.game.activePlayer.name);
        }
    }
}

module.exports = FirstPlayerSelection;
