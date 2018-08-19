const CardGameAction = require('./CardGameAction');

class FightGameAction extends CardGameAction {
    setup() {
        this.name = 'fight';
        this.targetType = ['creature'];
        this.effectMsg = 'fight with {0}';
    }

    canAffect(card, context) {
        let fightAction = card.abilities.actions.find(action => action.title === 'Fight with this creature');
        if(!fightAction || fightAction.meetsRequirements(fightAction.createContext(context.player), ['house'])) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        if(card.stunned) {
            return super.createEvent('onRemoveStun', { card, context }, () => card.unstun());
        }
        return super.createEvent('unnamedEvent', {card, context}, () => {
            let fightAction = card.abilities.actions.find(action => action.title === 'Fight with this creature');
            let fightContext = fightAction.createContext(context.player);
            fightContext.canCancel = false;
            context.game.resolveAbility(fightContext);
        });
    }
}

module.exports = FightGameAction;
