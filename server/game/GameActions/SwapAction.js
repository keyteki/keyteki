const CardGameAction = require('./CardGameAction');

class SwapAction extends CardGameAction {
    setDefaultProperties() {
        this.origin = null;
    }

    update(context) {
        this.applyProperties(
            Object.assign(
                { target: this.getDefaultTargets(context), origin: context.source },
                this.propertyFactory(context)
            )
        );
    }

    setup() {
        this.name = 'swap';
        this.targetType = ['creature'];
        this.effectMsg = 'swap the position of {0} and {1}';
        this.effectArgs = this.origin;
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onSwap', { card: card, context: context }, () => {
            let originIndex = this.origin.controller.cardsInPlay.indexOf(this.origin);
            let cardIndex = card.controller.cardsInPlay.indexOf(card);
            if (originIndex >= 0 && cardIndex >= 0) {
                this.origin.controller.cardsInPlay.splice(originIndex, 1, card);
                card.controller.cardsInPlay.splice(cardIndex, 1, this.origin);
            }
        });
    }
}

module.exports = SwapAction;
