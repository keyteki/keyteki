const CardGameAction = require('./CardGameAction');

class ResolveReapAction extends CardGameAction {
    setup() {
        this.name = 'reap';
        this.targetType = ['creature'];
        this.message = 'reap with {target}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || !card.checkRestrictions('reap')) {
            return false;
        }

        return card.checkRestrictions('use', context) && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onReap', { card: card, context: context }, () => {
            context.game.actions.gainAmber().resolve(context.player, context);
        });
    }
}

module.exports = ResolveReapAction;
