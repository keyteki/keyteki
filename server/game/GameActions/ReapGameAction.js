const CardGameAction = require('./CardGameAction');

class ReapGameAction extends CardGameAction {
    setup() {
        this.name = 'reap';
        this.targetType = ['creature'];
        this.effectMsg = 'reap with {0}';
    }

    canAffect(card, context) {
        let reapAction = card.getReapAction();
        let newContext = reapAction.createContext(context.player);
        newContext.ignoreHouse = true;
        if(reapAction.meetsRequirements(newContext, ['stunned'])) {
            return false;
        }

        return card.checkRestrictions('use', context) && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card, context }, () => {
            let newContext;
            if(card.stunned) {
                let removeStunAction = card.getActions().find(action => action.title === 'Remove this creature\'s stun');
                newContext = removeStunAction.createContext(context.player);
            } else {
                let reapAction = card.getReapAction();
                newContext = reapAction.createContext(context.player);
            }

            newContext.canCancel = false;
            context.game.resolveAbility(newContext);
        });
    }
}

module.exports = ReapGameAction;
