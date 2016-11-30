const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class WildfireAssault extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.state = {};
    }
    
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        var firstPlayer = this.game.getFirstPlayer();

        if(!firstPlayer) {
            return true;
        }

        var otherPlayer = this.game.getOtherPlayer(firstPlayer);

        this.state[firstPlayer.id] = {};
        this.state[firstPlayer.id].selecting = true;
        this.state[firstPlayer.id].doneSelecting = false;

        this.setupSelection(firstPlayer);

        if(otherPlayer) {
            this.state[otherPlayer.id] = {};
            this.state[otherPlayer.id].selecting = false;
            this.state[otherPlayer.id].doneSelecting = false;
        }

        return false;
    }

    setupSelection(player) {
        var buttons = [{ command: 'plot', method: 'cancelSelection', text: 'Done' }];

        this.state[player.id].selecting = true;

        var otherPlayer = this.game.getOtherPlayer(player);
        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to select characters';
            otherPlayer.buttons = [];
        }

        this.waitingForSelection = true;

        this.game.promptForSelectDeprecated(player, this.onCardSelected.bind(this), 'Select characters to save', buttons, true);
    }

    cancelSelection(player) {
        if(!this.inPlay || !this.waitingForSelection || !this.state[player.id].selecting) {
            return;
        }

        this.state[player.id].doneSelecting = true;

        this.proceedToNextStep();
    }

    onCardSelected(player, cardId) {
        if(!this.inPlay || !this.waitingForSelection || !this.state[player.id].selecting) {
            return false;
        }

        var card = player.findCardInPlayByUuid(cardId);
        if(!card || card.getType() !== 'character') {
            return false;
        }

        var numSelected = player.cardsInPlay.reduce((counter, card) => {
            if(!card.selected) {
                return counter;
            }

            return counter + 1;
        }, 0);

        if(numSelected === 3 && !card.selected) {
            return false;
        }

        card.selected = !card.selected;

        return true;
    }

    doDiscard() {
        var sortedPlayers = this.game.getPlayersInFirstPlayerOrder();

        _.each(sortedPlayers, player => {
            var toKill = player.cardsInPlay.filter(card => {
                return card.getType() === 'character' && !card.selected;
            });

            var params = '';
            var paramIndex = 2;

            _.each(toKill, card => {
                card.selected = false;

                player.discardCard(card.uuid, player.deadPile);

                params += '{' + paramIndex++ + '} ';

            });

            if(_.isEmpty(toKill)) {
                this.game.addMessage('{0} does not kill any characters with {1}', player, this);
            } else {
                this.game.addMessage('{0} uses {1} to kill ' + params, player, this, ...toKill);                
            }

            player.cardsInPlay.each(card => {
                card.selected = false;
            });

            player.selectCard = false;
        });

        _.each(this.state, s => {
            s.selecting = false;
        });

        this.waitingForSelection = false;
        
        this.game.playerRevealDone(this.owner);
    }

    proceedToNextStep() {
        var stillToSelect = _.find(this.game.getPlayers(), player => {
            return !this.state[player.id].doneSelecting;
        });

        if(!stillToSelect) {
            this.doDiscard();

            return;
        }

        this.setupSelection(stillToSelect);
    }
}

WildfireAssault.code = '01026';

module.exports = WildfireAssault;
