const AllPlayerPrompt = require('./allplayerprompt');
const RematchPrompt = require('./RematchPrompt');

class GameWonPrompt extends AllPlayerPrompt {
    constructor(game, winner) {
        super(game);
        this.winner = winner;
        this.clickedButton = {};
    }

    completionCondition(player) {
        return !!this.clickedButton[player.name];
    }

    activePrompt() {
        return {
            promptTitle: 'Game Won',
            menuTitle: { text: '{{player}} has won the game!', values: { player: this.winner.name } },
            buttons: [
                { arg: 'continue', text: 'Continue Playing' },
                { arg: 'rematch', text: 'Rematch' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose to continue' };
    }

    menuCommand(player, arg) {
        let message = arg === 'continue' ? 'to continue' : 'a rematch';
        this.game.addMessage('{0} would like {1}', player, message);

        this.clickedButton[player.name] = true;

        if(arg === 'rematch') {
            this.game.queueStep(new RematchPrompt(this.game, player));

            return true;
        }

        return true;
    }
}

module.exports = GameWonPrompt;
