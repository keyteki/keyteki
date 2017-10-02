const UiPrompt = require('./uiprompt.js');

class ActionWindow extends UiPrompt {
    constructor(game, title, windowName) {
        super(game);

        this.title = title;
        this.windowName = windowName;
        if(this.game.currentConflict && !this.game.currentConflict.isSinglePlayer) {
            this.currentPlayer = this.game.currentConflict.defendingPlayer;
        } else {
            this.currentPlayer = game.getFirstPlayer();
        }
        this.prevPlayerPassed = false;
        this.game.currentActionWindow = this;
        
        if(!this.currentPlayer.promptedActionWindows[this.windowName]) {
            this.game.addMessage('{0} has chosen to pass', this.currentPlayer);
            this.prevPlayerPassed = true;
            this.nextPlayer();
        }
        
    }
    
    activeCondition(player) {
        return player === this.currentPlayer;
    }

    continue() {
        let completed = super.continue();

        if(!completed) {
            this.game.currentActionWindow = this;
            this.currentPlayer.canInitiateAction = true;
        } else {
            this.game.currentActionWindow = null;
        }

        return completed;
    }

    activePrompt() {
        let buttons = [
            { text: 'Pass', arg: 'pass' }
        ];
        if(this.game.manualMode) {
            buttons.unshift({ text: 'Manual Action', arg: 'manual'});
        }
        return {
            menuTitle: 'Initiate an action',
            buttons: buttons,
            promptTitle: this.title
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to take an action or pass.' };
    }

    onMenuCommand(player, choice) {
        if(this.currentPlayer !== player) {
            return false;
        }
        
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
        
        this.game.addMessage('{0} has chosen to pass', this.currentPlayer);
        
        if(this.prevPlayerPassed) {
            this.complete();
            return true;
        }

        this.prevPlayerPassed = true;
        this.nextPlayer();

        return true;
    }
    
    nextPlayer() {
        let otherPlayer = this.game.getOtherPlayer(this.currentPlayer);
        
        if(otherPlayer) {
            if(!otherPlayer.promptedActionWindows[this.windowName]) {
                this.game.addMessage('{0} has chosen to pass', this.currentPlayer);
                if(this.prevPlayerPassed) {
                    this.complete();
                } else {
                    this.prevPlayerPassed = true;
                }
            } else {
                this.currentPlayer = otherPlayer;
            }
        } else if(this.prevPlayerPassed) {
            this.complete();
        }
    }

    markActionAsTaken() {
        this.prevPlayerPassed = false;
        this.nextPlayer();
    }
}

module.exports = ActionWindow;
