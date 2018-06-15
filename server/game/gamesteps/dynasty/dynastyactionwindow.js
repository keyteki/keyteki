const ActionWindow = require('../actionwindow.js');

class DynastyActionWindow extends ActionWindow {
    constructor(game) {
        super(game, 'Play cards from provinces', 'dynasty');
    }

    activePrompt() {
        let props = super.activePrompt();
        return {
            menuTitle: 'Click pass when done',
            buttons: props.buttons,
            promptTitle: this.title
        };
    }

    pass() {
        this.currentPlayer.passDynasty();
        if(!this.currentPlayer.opponent || !this.currentPlayer.opponent.passedDynasty) {
            this.game.addMessage('{0} is the first to pass, and gains 1 fate', this.currentPlayer);
            this.game.raiseEvent('onFirstPassDuringDynasty', { player: this.currentPlayer }, event => this.game.addFate(event.player, 1));
        } else {
            this.game.addMessage('{0} passes', this.currentPlayer);
        }
        if(!this.currentPlayer.opponent || this.currentPlayer.opponent.passedDynasty) {
            this.complete();
        } else {
            this.nextPlayer();
        }
    }
    
    nextPlayer() {
        let otherPlayer = this.currentPlayer.opponent;
        if(otherPlayer && !otherPlayer.passedDynasty) {
            this.currentPlayer = otherPlayer;
        }
    }
}

module.exports = DynastyActionWindow;
