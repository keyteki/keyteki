const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class TheLongWinter extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.selections = [];
                this.remainingPlayers = _.reject(this.game.getPlayersInFirstPlayerOrder(), player => player.activePlot.hasTrait('Summer'));
                this.proceedToNextStep();
            }
        });
    }

    cancelSelection(player) {
        this.game.addMessage('{0} has cancelled the resolution of {1}', player, this);
        this.proceedToNextStep();
        return true;
    }

    selectFactionCard(player, arg) {
        if(arg !== 'faction') {
            return false;
        }

        this.selections.push({ player: player, factionCard: true });
        this.game.addMessage('{0} has selected their faction to lose power from {2}', player, this);
        this.proceedToNextStep();
        return true;
    }

    onCardSelected(player, card) {
        this.selections.push({ player: player, card: card });
        this.game.addMessage('{0} has selected {1} to lose power from {2}', player, card, this);
        this.proceedToNextStep();
        return true;
    }

    doPower() {
        _.each(this.selections, selection => {
            var player = selection.player;

            if(selection.factionCard) {
                this.game.addPower(player, -1);
                this.game.addMessage('{0} discards 1 power from their faction card from {1}', player, this);
            } else if(selection.card) {
                this.game.addMessage('{0} discards 1 power from {1}', player, selection.card);
                selection.card.modifyPower(-1);
            }
        });

        this.selections = [];
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            var currentPlayer = this.remainingPlayers.shift();
            this.game.promptForSelect(currentPlayer, {
                activePromptTitle: 'Select a card to discard power from',
                source: this,
                additionalButtons: [{ text: 'Faction Card', arg: 'faction' }],
                cardCondition: card => card.controller === currentPlayer && card.getPower() > 0,
                onSelect: (player, card) => this.onCardSelected(player, card),
                onMenuCommand: (player, arg) => this.selectFactionCard(player, arg),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doPower();
        }
    }
}

TheLongWinter.code = '03049';

module.exports = TheLongWinter;
