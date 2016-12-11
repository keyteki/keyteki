const PlotCard = require('../../../plotcard.js');

class Confiscation extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.controller !== player) {
            return true;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select an attachment to discard',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return false;
    }

    cardCondition(card) {
        return card.getType() === 'attachment';
    }

    onCardSelected(player, attachment) {
        if(!this.inPlay) {
            return false;
        }

        attachment.owner.discardCard(attachment);

        this.game.addMessage('{0} uses {1} to discard {2}', player, this, attachment);

        return true;
    }
}

Confiscation.code = '01009';

module.exports = Confiscation;
