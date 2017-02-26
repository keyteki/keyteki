const PlotCard = require('../../../plotcard.js');

class Confiscation extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(card),
                    activePromptTitle: 'Select an attachment to discard',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return card.getType() === 'attachment';
    }

    onCardSelected(player, attachment) {
        attachment.owner.discardCard(attachment);

        this.game.addMessage('{0} uses {1} to discard {2}', player, this, attachment);

        return true;
    }
}

Confiscation.code = '01009';

module.exports = Confiscation;
