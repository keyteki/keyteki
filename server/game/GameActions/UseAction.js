const CardGameAction = require('./CardGameAction');

class UseAction extends CardGameAction {
    setup() {
        this.name = 'use';
        this.targetType = ['creature', 'artifact'];
        this.effectMsg = 'use {0}';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context) && card.getLegalActions(context.player, true).length > 0;
    }

    getEvent(card, context) {
        return super.createEvent('onUseCard', { card: card, context: context }, () => card.use(context.player, true));
    }
}

module.exports = UseAction;
