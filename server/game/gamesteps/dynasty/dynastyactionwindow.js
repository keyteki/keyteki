const ActionWindow = require('../actionwindow.js');

class DynastyActionWindow extends ActionWindow {
    constructor(game) {
        super(game, 'Play cards from provinces', 'dynasty');
    }

    activePrompt() {
        let buttons = [
            { text: 'Pass', arg: 'pass' }
        ];
        if(this.game.manualMode) {
            buttons.unshift({ text: 'Manual Action', arg: 'manual'});
        }
        return {
            menuTitle: 'Click pass when done',
            buttons: buttons,
            promptTitle: this.title
        };
    }

    pass() {
        this.currentPlayer.passDynasty();
        if(!this.currentPlayer.opponent || !this.currentPlayer.opponent.passedDynasty) {
            this.game.addMessage('{0} is the first to pass, and gains 1 fate.', this.currentPlayer);
            this.game.raiseEvent('onFirstPassDuringDynasty', { player: this.currentPlayer }, event => this.game.addFate(event.player, 1));
        } else {
            this.game.addMessage('{0} passes.', this.currentPlayer);
        }

        if(!this.currentPlayer.opponent || this.currentPlayer.opponent.passedDynasty) {
            this.complete();
        } else {
            this.nextPlayer();
        }
    }
    
    nextPlayer() {
        let otherPlayer = this.game.getOtherPlayer(this.currentPlayer);
        if(otherPlayer && !otherPlayer.passedDynasty) {
            this.currentPlayer = otherPlayer;
        }
    }
}

module.exports = DynastyActionWindow;
