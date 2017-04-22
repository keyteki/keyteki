const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class WildfireAssault extends PlotCard {
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
        if(_.isEmpty(cards)) {
            this.game.addMessage('{0} does not choose any characters to save from {1}', player, this);
        } else {
            this.game.addMessage('{0} chooses to save {1} from {2}', player, cards, this);
        }
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
            var toKill = _.difference(player.filterCardsInPlay(card => card.getType() === 'character'), selection.cards);

            _.each(toKill, card => {
                player.killCharacter(card, false);
            });

            if(_.isEmpty(toKill)) {
                this.game.addMessage('{0} does not kill any characters with {1}', player, this);
            } else {
                this.game.addMessage('{0} uses {1} to kill {2}', player, this, toKill);
            }
        });

        this.selections = [];
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            var currentPlayer = this.remainingPlayers.shift();
            this.game.promptForSelect(currentPlayer, {
                numCards: 3,
                activePromptTitle: 'Select up to 3 characters to save',
                source: this,
                cardCondition: card => card.controller === currentPlayer && card.getType() === 'character',
                onSelect: (player, cards) => this.onSelect(player, cards),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doDiscard();
        }
    }
}

WildfireAssault.code = '01026';

module.exports = WildfireAssault;
