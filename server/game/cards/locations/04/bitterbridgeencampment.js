const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class BitterbridgeEncampment extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotRevealed']);
    }

    onPlotRevealed(event, player) {
        if(this.kneeled || !player.activePlot.hasTrait('Summer') || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'kneel' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to trigger ' + this.name
        });
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }

    kneel(player) {
        if(this.controller !== player) {
            return false;
        }

        player.kneelCard(this);

        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
        this.selections = [];
        this.proceedToNextStep();

        return true;
    }

    cancelSelection(player) {
        this.game.addMessage('{0} has cancelled the resolution of {1}', player, this);
        this.proceedToNextStep();
    }
   
    onCardSelected(player, card) {
        this.selections.push({ player: player, card: card });
        this.game.addMessage('{0} has selected {1} to put into play with {2}', player, card, this);
        this.proceedToNextStep();

        return true;
    }

    doPutIntoPlay() {
        _.each(this.selections, selection => {
            var player = selection.player;
            player.playCard(selection.card, true);
        });
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            var currentPlayer = this.remainingPlayers.shift();
            this.game.promptForSelect(currentPlayer, {
                activePromptTitle: 'Select a character to put into play',
                waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                cardCondition: card => card.controller === currentPlayer && card.getType() === 'character' && card.location === 'hand',
                onSelect: (player, card) => this.onCardSelected(player, card),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doPutIntoPlay();
        }
    }
}

BitterbridgeEncampment.code = '04005';

module.exports = BitterbridgeEncampment;
