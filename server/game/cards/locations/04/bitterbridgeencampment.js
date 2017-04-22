const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class BitterbridgeEncampment extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPlotsRevealed: event => _.any(event.plots, plot => plot.hasTrait('Summer'))
            },
            handler: () => {
                this.controller.kneelCard(this);

                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.selections = [];
                this.proceedToNextStep();
            }
        });
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
            player.putIntoPlay(selection.card);
        });
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            var currentPlayer = this.remainingPlayers.shift();
            this.game.promptForSelect(currentPlayer, {
                activePromptTitle: 'Select a character to put into play',
                source: this,
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
