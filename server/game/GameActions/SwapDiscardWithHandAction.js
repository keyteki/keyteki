const CardGameAction = require('./CardGameAction');

class SwapDiscardWithHandAction extends CardGameAction {
    setDefaultProperties() {
        this.discardCard = null;
    }

    update(context) {
        this.applyProperties(
            Object.assign(
                { target: this.getDefaultTargets(context), discardCard: context.source },
                this.propertyFactory(context)
            )
        );
    }

    setup() {
        this.name = 'swapDiscardWithHand';
        this.effectMsg = 'swap {0} from hand with {1} from the discard';
        this.effectArgs = this.discardCard;
        super.setup();
    }

    canAffect(card, context) {
        return (
            card.location === 'hand' &&
            this.discardCard &&
            this.discardCard.location === 'discard' &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent('onSwapDiscardWithHand', { card: card, context: context }, () => {
            let discardIndex = this.discardCard.controller.discard.indexOf(this.discardCard);
            let cardIndex = card.controller.hand.indexOf(card);
            if (discardIndex >= 0 && cardIndex >= 0) {
                this.discardCard.controller.discard.splice(discardIndex, 1, card);
                card.location = 'discard';
                card.controller.hand.splice(cardIndex, 1, this.discardCard);
                this.discardCard.location = 'hand';
            }
        });
    }
}

module.exports = SwapDiscardWithHandAction;
