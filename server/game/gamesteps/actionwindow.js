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
        if(this.currentPlayer.opponent && !this.currentPlayer.allowGameAction('takeFirstAction')) {
            this.currentPlayer = this.currentPlayer.opponent;
        }
        this.prevPlayerPassed = false;
        this.priorityPassed = false;
    }

    activeCondition(player) {
        return player === this.currentPlayer;
    }

    onCardClicked(player, card) {
        if(player !== this.currentPlayer) {
            return false;
        }

        let actions = card.getActions(player);

        let legalActions = actions.filter(action => action.meetsRequirements() === '');

        if(legalActions.length === 0) {
            return false;
        } else if(legalActions.length === 1) {
            let action = legalActions[0];
            let targetPrompts = action.targets.some(target => target.properties.player !== 'opponent');
            if(!this.currentPlayer.optionSettings.confirmOneClick || action.cost.some(cost => cost.promptsPlayer) || targetPrompts) {
                this.game.resolveAbility(action.createContext());
                return true;
            }
        }
        this.game.promptWithHandlerMenu(player, {
            activePromptTitle: (card.location === 'play area' ? 'Choose an ability:' : 'Play ' + card.name + ':'),
            source: card,
            choices: legalActions.map(action => action.title).concat('Cancel'),
            handlers: legalActions.map(action => (() => this.game.resolveAbility(action.createContext()))).concat(() => true)
        });
        return true;
    }

    continue() {
        if(!this.currentPlayer.promptedActionWindows[this.windowName]) {
            this.pass();
            if(!this.currentPlayer.promptedActionWindows[this.windowName]) {
                this.pass();
            }
        }

        let completed = super.continue();

        if(!completed) {
            this.game.currentActionWindow = this;
            this.priorityPassed = false;
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
        return { menuTitle: 'Waiting for opponent to take an action or pass' };
    }

    menuCommand(player, choice) {
        if(choice === 'manual') {
            this.game.promptForSelect(this.currentPlayer, {
                source: 'Manual Action',
                activePrompt: 'Which ability are you using?',
                location: 'any',
                controller: 'self',
                cardCondition: card => !card.facedown,
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1}\'s ability', player, card);
                    this.markActionAsTaken();
                    return true;
                }
            });
            return true;
        }

        if(choice === 'pass') {
            this.pass();
            return true;
        }
    }

    pass() {
        this.game.addMessage('{0} passes', this.currentPlayer);

        if(this.prevPlayerPassed || !this.currentPlayer.opponent) {
            this.complete();
        }

        this.prevPlayerPassed = true;
        this.nextPlayer();
    }

    nextPlayer() {
        let otherPlayer = this.game.getOtherPlayer(this.currentPlayer);

        if(otherPlayer) {
            this.currentPlayer = otherPlayer;
        }
    }

    markActionAsTaken() {
        if(!this.priorityPassed) {
            this.prevPlayerPassed = false;
            this.nextPlayer();
            this.priorityPassed = true;
        }
    }
}

module.exports = ActionWindow;
