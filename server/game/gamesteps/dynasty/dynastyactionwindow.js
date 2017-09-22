const _ = require('underscore');
const ActionWindow = require('../actionwindow.js');

class DynastyActionWindow extends ActionWindow {
    constructor(game) {
        super(game, 'Play cards from provinces', 'DynastyActionWindow');
        if(!this.currentPlayer.promptedActionWindows[this.windowName]) {
            this.game.addFate(this.currentPlayer, 1);
            this.game.addMessage('{0} is the first to pass, and gains 1 fate.', this.currentPlayer);
            this.currentPlayer.passedDynasty = true;
            this.nextPlayer();
        }
    }

    activePrompt() {
        let buttons = [
            { text: 'Pass', arg: 'pass' }
        ];
        if(this.game.manualMode) {
            buttons.unshift({ text: 'Mannual Action', arg: 'manual'});
        }
        return {
            menuTitle: 'Click pass when done',
            buttons: buttons,
            promptTitle: this.title
        };
    }

    onMenuCommand(player, choice) {
        if(this.currentPlayer !== player) {
            return false;
        }

        if(choice === 'manual') {
            this.game.promptForSelect(this.currentPlayer, {
                activePrompt: 'Which ability are you using?',
                cardCondition: card => (card.controller === this.currentPlayer || card === this.currentPlayer.stronghold),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1}\'s ability', player, card);
                    this.markActionAsTaken();
                    return true;
                }
            });
            return true;
        }
        
        if(choice === 'pass') {

            if(_.all(this.game.getPlayers(), player => {
                return player.passedDynasty === false;
            })) {
                this.game.addFate(this.currentPlayer, 1);
                this.game.addMessage('{0} is the first to pass, and gains 1 fate.', player);
            } else {
                this.game.addMessage('{0} has chosen to pass.', player);

            }

            this.currentPlayer.passDynasty();
            this.nextPlayer();
        }

    }
    
    nextPlayer() {
        let otherPlayer = this.game.getOtherPlayer(this.currentPlayer);
        if(otherPlayer && !otherPlayer.passedDynasty) {
            if(!otherPlayer.promptedActionWindow[this.windowName]) {
                otherPlayer.passedDynasty = true;
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
