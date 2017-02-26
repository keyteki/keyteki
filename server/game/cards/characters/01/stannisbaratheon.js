const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class StannisBaratheon extends DrawCard {
    setupCardAbilities() {
        // TODO: This is a hack, as Stannis' ability is a persistent effect, not
        //       an interrupt.
        this.forcedInterrupt({
            when: {
                onStandAllCards: () => true
            },
            handler: context => {
                context.skipHandler();
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

    doStand() {
        _.each(this.selections, selection => {
            var player = selection.player;
            var toStand = selection.cards;

            _.each(toStand, card => {
                card.controller.standCard(card);
            });

            if(_.isEmpty(toStand)) {
                this.game.addMessage('{0} does not stand any characters with {1}', player, this);
            } else {
                this.game.addMessage('{0} uses {1} to stand {2}', player, this, toStand);
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
                source: this,
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
