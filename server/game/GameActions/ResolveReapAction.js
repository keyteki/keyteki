const CardGameAction = require('./CardGameAction');

class ResolveReapAction extends CardGameAction {
    setup() {
        this.name = 'reap';
        this.targetType = ['creature'];
        this.effectMsg = 'reap with {0}';
    }

    canAffect(card, context) {
        if (card.location !== 'play area' || !card.checkRestrictions('reap')) {
            return false;
        }

        return card.checkRestrictions('use', context) && super.canAffect(card, context);
    }

    getEvent(card, context) {
        let reapEvent = super.createEvent('onReap', { card: card, context: context }, () => {
            context.game.actions.gainAmber().resolve(context.player, context);
        });

        reapEvent.addChildEvent(context.game.getEvent('onUseCard', { card, context }));

        return reapEvent;
    }
}

module.exports = ResolveReapAction;
