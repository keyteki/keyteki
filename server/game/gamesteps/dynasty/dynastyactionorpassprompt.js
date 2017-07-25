const _ = require('underscore');
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
            menuTitle: 'Click pass when done',
            buttons: [
                { text: 'Pass', arg: 'pass' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to finish taking actions or pass.' };
    }

    onMenuCommand(player, choice) {
        if(this.player !== player) {
            return false;
        }

        if(choice === 'pass') {
            this.game.addMessage('{0} has chosen to pass.', player);

            if(_.all(this.game.getPlayers(), player => {
                return player.passedDynasty === false;
            })) {
                this.game.addFate(this.player, 1);
                this.player.passDynasty();
            } else {
                this.player.passDynasty();
            }
        }

        this.complete();
    }
}

module.exports = DynastyActionOrPassPrompt;
