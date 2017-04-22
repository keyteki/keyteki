const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class PoliticalDisaster extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.selections = [];
                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.proceedToNextStep();
            }
        });
    }

    onSelect(player, cards) {
        this.selections.push({ player: player, cards: cards });
        this.proceedToNextStep();
        return true;
    }

    cancelSelection(player) {
        this.selections.push({ player: player, cards: [] });
        this.proceedToNextStep();
    }

    doDiscard() {
        _.each(this.selections, selection => {
            var player = selection.player;
            var toDiscard = _.difference(player.filterCardsInPlay(card => card.getType() === 'location'), selection.cards);

            _.each(toDiscard, card => {
                player.discardCard(card);
            });

            if(_.isEmpty(toDiscard)) {
                this.game.addMessage('{0} does not discard any locations with {1}', player, this);
            } else {
                this.game.addMessage('{0} uses {1} to discard {2}', player, this, toDiscard);
            }
        });

        this.selections = [];
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            var currentPlayer = this.remainingPlayers.shift();
            this.game.promptForSelect(currentPlayer, {
                numCards: 2,
                activePromptTitle: 'Select up to 2 locations to save',
                source: this,
                cardCondition: card => card.controller === currentPlayer && card.getType() === 'location',
                onSelect: (player, cards) => this.onSelect(player, cards),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doDiscard();
        }
    }
}

PoliticalDisaster.code = '02040';

module.exports = PoliticalDisaster;
