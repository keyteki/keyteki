const CardGameAction = require('./CardGameAction');

class ReapGameAction extends CardGameAction {
    setup() {
        this.name = 'reap';
        this.targetType = ['creature'];
        this.effectMsg = 'reap with {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || card.exhausted) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        if(card.stunned) {
            return super.createEvent('onRemoveStun', {card: card, context: context}, () => {
                context.game.cardsUsed.push(context.source);
                card.exhaust();
                card.unstun();
            });
        }
        return super.createEvent('onReap', { card: card, context: context }, () => {
            context.game.cardsUsed.push(context.source);
            card.exhaust();
            card.controller.modifyAmber(1);
        });
    }
}

module.exports = ReapGameAction;
