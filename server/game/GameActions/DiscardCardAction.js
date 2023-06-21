const CardGameAction = require('./CardGameAction');

class DiscardCardAction extends CardGameAction {
    setDefaultProperties() {
        this.notChosen = false;
    }

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = 'discard {0}';
        this.cost = 'discarding {0}';
    }

    canAffect(card, context) {
        if (
            (!card.checkRestrictions('selfChooseDiscard', context) ||
                !context.player.checkRestrictions('selfChooseDiscard', context)) &&
            !this.notChosen &&
            context.player === card.controller
        ) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let location = card.location;
        return super.createEvent('onCardDiscarded', { card, context, location }, () => {
            if (card.location === 'hand') {
                context.game.cardDiscarded(card);
            }

            card.owner.moveCard(card, 'discard');
        });
    }
}

module.exports = DiscardCardAction;
