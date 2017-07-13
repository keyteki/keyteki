const UiPrompt = require('../uiprompt.js');

class DynastyActionOrPassPrompt extends UiPrompt {
    constructor(game, player) {
        super(game);
        this.player = player;
    }

    activeCondition(player) {
        return this.player === player;
    }

    activePrompt() {
        return {
            menuTitle: 'Take an action or pass',
            buttons: [
                { text: 'Take an action', arg: 'action' },
                { text: 'Pass', arg: 'pass' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose take an action or pass.' };
    }

    onMenuCommand(player, choice) {
        if(this.player !== player) {
            return false;
        }

        if(choice === 'action') {
            this.game.addMessage('{0} is taking an action.', player);
        } else if(choice === 'pass') {
            this.game.addMessage('{0} has chosen to pass.', player);
            //Update player, set pass = true
        }

        this.complete();
    }
}

module.exports = DynastyActionOrPassPrompt;