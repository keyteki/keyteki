const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class StannisBaratheon extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onBeforeCardsStand']);
    }

    onBeforeCardsStand(event) {
        if(this.isBlank()) {
            return;
        }

        event.cancel = true;
        
        this.selections = [];
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
        this.proceedToNextStep();
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

    doStand() {
        _.each(this.selections, selection => {
            var player = selection.player;
            var toStand = selection.cards;

            var params = '';
            var paramIndex = 2;

            _.each(toStand, card => {
                card.kneeled = false;

                params += '{' + paramIndex++ + '} ';

            });

            if(_.isEmpty(toStand)) {
                this.game.addMessage('{0} does not stand any characters with {1}', player, this);
            } else {
                this.game.addMessage('{0} uses {1} to stand ' + params, player, this, ...toStand);
            }

            // Stand all non character cards
            player.standCards(true);
        });

        this.selections = [];
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            var currentPlayer = this.remainingPlayers.shift();
            this.game.promptForSelect(currentPlayer, {
                numCards: 2,
                activePromptTitle: 'Select up to 2 characters to stand',
                waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                cardCondition: card => card.controller === currentPlayer && card.getType() === 'character',
                onSelect: (player, cards) => this.onSelect(player, cards),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doStand();
        }
    }
}

StannisBaratheon.code = '01052';

module.exports = StannisBaratheon;
