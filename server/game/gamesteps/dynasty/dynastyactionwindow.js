const _ = require('underscore');
const ActionWindow = require('../actionwindow.js');

class DynastyActionWindow extends ActionWindow {
    constructor(game) {
        super(game, 'Play cards from provinces', 'dynasty');
        if(!this.currentPlayer.promptedActionWindows[this.windowName]) {
            this.pass(this.currentPlayer);
            this.nextPlayer();
        }
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

    menuCommand(player, choice) {
        player.canInitiateAction = false;

        if(choice === 'manual') {
            this.game.promptForSelect(this.currentPlayer, {
                activePrompt: 'Which ability are you using?',
                cardCondition: card => (card.controller === this.currentPlayer && !card.facedown),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1}\'s ability', player, card);
                    this.markActionAsTaken();
                    return true;
                }
            });
            return true;
        }
        
        if(choice === 'pass') {
            this.pass(player);
            this.nextPlayer();
            return true;
        }

    }
    
    pass(player) {
        if(_.all(this.game.getPlayers(), p => {
            return p.passedDynasty === false;
        })) {
            this.game.addFate(this.currentPlayer, 1);
            this.game.addMessage('{0} is the first to pass, and gains 1 fate.', player);
        } else {
            this.game.addMessage('{0} has chosen to pass.', player);
        }
        player.passDynasty();       
    }
    
    nextPlayer() {
        let otherPlayer = this.game.getOtherPlayer(this.currentPlayer);
        if(otherPlayer && !otherPlayer.passedDynasty) {
            if(!otherPlayer.promptedActionWindows[this.windowName]) {
                this.pass(otherPlayer);
            } else {
                this.currentPlayer = otherPlayer;
            }
        }
        
        if(this.currentPlayer.passedDynasty) {
            this.complete();
        }
    }
}

module.exports = DynastyActionWindow;
