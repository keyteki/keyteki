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

        return super.canPlay(player, card);
    }

    play(player) {
        this.game.promptForSelect(player, {
            numCards: 99,
            activePromptTitle: 'Select characters',
            source: this,
            maxStat: () => 4,
            cardStat: card => card.getStrength(),
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && !card.kneeled,
            gameAction: 'kneel',
            onSelect: (player, cards) => this.onSelect(player, cards),
            onCancel: (player) => this.cancelSelection(player)
        });
    }

    onSelect(player, cards) {
        this.cards = cards;

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character to gain power',
            source: this,
            cardCondition: card => {
                return _.contains(this.cards, card);
            },
            onSelect: (player, card) => this.onPowerSelected(player, card),
            onCancel: (player) => this.cancelSelection(player)
        });

        return true;
    }

    onPowerSelected(player, card) {
        _.each(this.cards, card => {
            card.controller.kneelCard(card);
        });

        card.modifyPower(1);

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, this.cards);
        this.game.addMessage('{0} uses {1} to have {2} gain 1 power', player, this, card);

        return true;
    }

    cancelSelection(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);
    }
}

ConsolidationOfPower.code = '01062';

module.exports = ConsolidationOfPower;
