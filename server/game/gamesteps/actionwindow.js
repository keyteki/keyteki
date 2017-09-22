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
        this.game.actionWindow = this;
        
        if(!this.currentPlayer.promptedActionWindows[this.windowName]) {
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
            buttons.unshift({ text: 'Mannual Action', arg: 'manual'});
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

    skipCondition(player) {
        return !this.forceWindow && !player.promptedActionWindows[this.windowName];
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

    rotatedPlayerOrder(player) {
        var players = this.game.getPlayersInFirstPlayerOrder();
        var splitIndex = players.indexOf(player);
        var beforePlayer = players.slice(0, splitIndex);
        var afterPlayer = players.slice(splitIndex + 1);
        return afterPlayer.concat(beforePlayer).concat([player]);
    }
}

module.exports = ActionWindow;
