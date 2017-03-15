const DrawCard = require('../../../drawcard.js');

class GhiscariElite extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: (event, player, card) => (
                    card === this &&
                    this.controller.discardPile.any(c => this.eventOrAttachmentInDiscard(c))
                )
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    source: this,
                    cardCondition: card => this.eventOrAttachmentInDiscard(card),
                    activePromptTitle: 'Select attachment or event in discard',
                    onSelect: (player, card) => this.moveToBottomOfDeck(card)
                });
            }
        });
    }

    eventOrAttachmentInDiscard(card) {
        return (
            card.controller === this.controller &&
            card.location === 'discard pile' &&
            ['event', 'attachment'].includes(card.getType())
        );
    }

    moveToBottomOfDeck(card) {
        this.game.addMessage('{0} uses {1} to move {2} to the bottom of their deck', this.controller, this, card);
        this.controller.moveCard(card, 'draw deck', { bottom: true });
        return true;
    }
}

GhiscariElite.code = '06013';

module.exports = GhiscariElite;
