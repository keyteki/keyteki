const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class WildfireAssault extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        this.selections = [];
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
        this.proceedToNextStep();

        return false;
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
            var toKill = _.difference(player.cardsInPlay.filter(card => card.getType() === 'character'), selection.cards);

            var params = '';
            var paramIndex = 2;

            _.each(toKill, card => {
                player.killCharacter(card, false);

                params += '{' + paramIndex++ + '} ';

            });

            if(_.isEmpty(toKill)) {
                this.game.addMessage('{0} does not kill any characters with {1}', player, this);
            } else {
                this.game.addMessage('{0} uses {1} to kill ' + params, player, this, ...toKill);
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
                waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                cardCondition: card => card.owner === currentPlayer && card.getType() === 'character',
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
