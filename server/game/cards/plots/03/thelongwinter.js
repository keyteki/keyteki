const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class TheLongWinter extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        this.state = {};

        var firstPlayer = this.game.getFirstPlayer();

        if(!firstPlayer) {
            return true;
        }

        var otherPlayer = this.game.getOtherPlayer(firstPlayer);

        this.state[firstPlayer.id] = {};
        if(firstPlayer.activePlot.hasTrait('Summer')) {
            this.state[firstPlayer.id].doneSelecting = true;
            this.state[firstPlayer.id].needsToSelect = false;
        } else {
            this.state[firstPlayer.id].selecting = true;
            this.state[firstPlayer.id].selectedCard = undefined;
            this.state[firstPlayer.id].doneSelecting = false;
            this.state[firstPlayer.id].needsToSelect = true;
            this.setupSelection(firstPlayer);
        }

        if(otherPlayer) {
            this.state[otherPlayer.id] = {};
            
            if(otherPlayer.activePlot.hasTrait('Summer')) {
                this.state[otherPlayer.id].doneSelecting = true;
                this.state[otherPlayer.id].needsToSelect = false;
            } else {
                this.state[otherPlayer.id].selecting = false;
                this.state[otherPlayer.id].selectedCard = undefined;
                this.state[otherPlayer.id].doneSelecting = false;
                this.state[otherPlayer.id].needsToSelect = true;
            }
        }

        return false;
    }

    cancelSelection(player) {
        if(!this.inPlay || !this.state[player.id].selecting) {
            return;
        }

        this.game.cancelSelect(player);

        this.game.addMessage('{0} has cancelled the resolution of {1}', player, this);

        this.state[player.id].doneSelecting = true;

        this.proceedToNextStep();
    }

    selectFactionCard(player) {
        if(!this.inPlay || !this.state[player.id].selecting) {
            return false;
        }

        this.state[player.id].doneSelecting = true;
        this.state[player.id].factionCard = true;

        this.proceedToNextStep();

        player.selectedCard = false;

        return true;
    }

    onCardSelected(player, cardId) {
        if(!this.inPlay || !this.state[player.id].selecting) {
            return false;
        }

        var card = player.findCardInPlayByUuid(cardId);

        if(!card || card.getPower() === 0) {
            return false;
        }

        this.state[player.id].selecting = false;
        this.state[player.id].doneSelecting = true;
        this.state[player.id].selectedCard = card;

        this.game.addMessage('{0} has selected {1} to lose power from {2}', player, card, this);

        this.proceedToNextStep();

        return true;
    }

    setupSelection(player) {
        this.state[player.id].selecting = true;

        var buttons = [
            { command: 'plot', method: 'selectFactionCard', text: 'Faction Card' },
            { command: 'plot', method: 'cancelSelection', text: 'Done' }
        ];

        var otherPlayer = this.game.getOtherPlayer(player);
        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for oppoent to select';
            otherPlayer.buttons = [];
        }

        this.game.promptForSelectDeprecated(player, this.onCardSelected.bind(this), 'Select a card to discard power from', buttons);
    }

    doPower() {
        var sortedPlayers = this.game.getPlayersInFirstPlayerOrder();

        _.each(sortedPlayers, player => {
            var playerState = this.state[player.id];

            playerState.selecting = false;

            if(!playerState.needsToSelect) {
                return;
            }

            if(playerState.factionCard) {
                this.game.addPower(player, -1);

                this.game.addMessage('{0} discards 1 power from their faction card from {1}', player, this);
            } else if(playerState.selectedCard) {
                this.game.addMessage('{0} discards 1 power from {1}', player, playerState.selectedCard);
                this.state[player.id].selectedCard.power--;
            }
        });

        this.game.playerRevealDone(this.owner);
    }

    proceedToNextStep() {
        var stillToSelect = _.find(this.game.getPlayers(), player => {
            return !this.state[player.id].doneSelecting;
        });

        if(!stillToSelect) {
            this.doPower();

            return;
        }

        this.setupSelection(stillToSelect);
    }
}

TheLongWinter.code = '03049';

module.exports = TheLongWinter;
