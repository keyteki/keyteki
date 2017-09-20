const _ = require('underscore');
const ActionWindow = require('../actionwindow.js');

class DynastyActionWindow extends ActionWindow {
    constructor(game) {
        super(game, 'Play cards from provinces', 'DynastyActionWindow');
    }

    activePrompt() {
        return {
            menuTitle: 'Click pass when done',
            buttons: [
                { text: 'Pass', arg: 'pass' }
            ],
            promptTitle: this.title
        };
    }

    onMenuCommand(player, choice) {
        if(this.currentPlayer !== player) {
            return false;
        }

        if(choice === 'pass') {
            this.game.addMessage('{0} has chosen to pass.', player);

            if(_.all(this.game.getPlayers(), player => {
                return player.passedDynasty === false;
            })) {
                this.game.addFate(this.currentPlayer, 1);
            }

            this.currentPlayer.passDynasty();
            this.nextPlayer();
        }

    }
    
    nextPlayer() {
        let otherplayer = this.game.getOtherPlayer(this.currentPlayer);
        if(otherplayer && !otherplayer.passedDynasty) {
            this.currentPlayer = otherplayer;
        }
        
        if(this.currentPlayer.passedDynasty) {
            this.complete();
        }
    }
}

module.exports = DynastyActionWindow;
