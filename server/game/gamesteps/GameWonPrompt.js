import AllPlayerPrompt from './allplayerprompt.js';
import RematchPrompt from './RematchPrompt.js';
import RematchWithNewDecksPrompt from './RematchWithNewDecksPrompt.js';

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
            menuTitle: {
                text: '{{player}} has won the game!',
                values: { player: this.winner.name }
            },
            buttons: [
                { arg: 'continue', text: 'Continue Playing' },
                { arg: 'rematch', text: 'Rematch' },
                { arg: 'rematch-swap', text: 'Rematch: Swap Decks' },
                { arg: 'rematch-with-new-decks', text: 'Rematch: With New Decks' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose to continue' };
    }

    menuCommand(player, arg) {
        let message = '';
        switch (arg) {
            case 'continue':
                message = 'to continue';
                break;
            case 'rematch':
                message = 'a rematch';
                break;
            case 'rematch-swap':
                message = 'a rematch and swap decks';
                break;
            case 'rematch-with-new-decks':
                message = 'a rematch with new decks';
                break;
        }

        this.game.addMessage('{0} would like {1}', player, message);

        this.clickedButton[player.name] = true;

        if (arg === 'rematch') {
            this.game.queueStep(new RematchPrompt(this.game, player));

            return true;
        }

        if (arg === 'rematch-swap') {
            this.game.swap = !this.game.swap;
            this.game.queueStep(new RematchPrompt(this.game, player));

            return true;
        }

        if (arg === 'rematch-with-new-decks') {
            this.game.swap = false;
            this.game.queueStep(new RematchWithNewDecksPrompt(this.game, player));

            return true;
        }

        return true;
    }
}

export default GameWonPrompt;
