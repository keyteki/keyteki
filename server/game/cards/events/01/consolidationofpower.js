const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class ConsolidationOfPower extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        if(player.phase !== 'marshal') {
            return false;
        }

        return super.canPlay();
    }

    play(player) {
        this.selectedStrength = 0;

        this.game.promptForSelect(player, {
            numCards: 99,
            activePromptTitle: 'Select characters',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => {
                return !card.kneeled && (card.getStrength() + this.selectedStrength <= 4 || card.opponentSelected || card.selected);
            },
            onCardToggle: (player, card) => {
                if(card.opponentSelected || card.selected) {
                    this.selectedStrength += card.getStrength();
                } else {
                    this.selectedStrength -= card.getStrength();
                }
            },
            onSelect: (player, cards) => this.onSelect(player, cards),
            onCancel: (player) => this.cancelSelection(player)
        });
    }

    onSelect(player, cards) {
        this.cards = cards;

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character to gain power',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => {
                return _.contains(this.cards, card);
            },
            onSelect: (player, card) => this.onPowerSelected(player, card),
            onCancel: (player) => this.cancelSelection(player)
        });

        return true;
    }

    onPowerSelected(player, card) {
        var cardNames = '';
        var firstCard = true;
        var paramIndex = 2;

        _.each(this.cards, card => {
            if(!firstCard) {
                cardNames += ', {' + paramIndex++ + '}';
            } else {
                firstCard = false;
                cardNames += '{' + paramIndex++ + '}';
            }

            card.controller.kneelCard(card);
        });

        card.modifyPower(1);

        this.game.addMessage('{0} uses {1} to kneel ' + cardNames, player, this, ...this.cards);
        this.game.addMessage('{0} uses {1} to have {2} gain 1 power', player, this, card);

        this.selectedStrength = 0;

        return true;
    }

    cancelSelection(player) {
        this.selectedStrength = 0;

        this.game.addMessage('{0} cancels the resolution of {1}', player, this);
    }
}

ConsolidationOfPower.code = '01062';

module.exports = ConsolidationOfPower;
