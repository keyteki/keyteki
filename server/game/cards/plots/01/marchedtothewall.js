const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class MarchedToTheWall extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.selections = [];
                this.proceedToNextStep();
            }
        })
    }

    cancelSelection(player) {
        this.game.addMessage('{0} has cancelled the resolution of {1}', player, this);
        this.proceedToNextStep();
    }

    onCardSelected(player, card) {
        this.selections.push({ player: player, card: card });
        this.game.addMessage('{0} has selected {1} to discard from {2}', player, card, this);
        this.proceedToNextStep();
        return true;
    }

    doDiscard() {
        _.each(this.selections, selection => {
            var player = selection.player;
            player.discardCard(selection.card, false);
        });
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            var currentPlayer = this.remainingPlayers.shift();
            this.game.promptForSelect(currentPlayer, {
                activePromptTitle: 'Select a character to discard',
                waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                cardCondition: card => card.controller === currentPlayer && card.getType() === 'character',
                onSelect: (player, cards) => this.onCardSelected(player, cards),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doDiscard();
        }
    }
}

MarchedToTheWall.code = '01015';

module.exports = MarchedToTheWall;
