const CardGameAction = require('./CardGameAction');

class FightGameAction extends CardGameAction {
    setDefaultProperties() {
        this.fightCardCondition = null;
        this.resolveFightPostHandler = null;
        this.ignoreTaunt = false;
    }

    setup() {
        this.name = 'fight';
        this.targetType = ['creature'];
        this.effectMsg = 'fight with {0}';
    }

    canAffect(card, context) {
        let fightAction = card.stunned
            ? card.getRemoveStunAction()
            : card.getFightAction(this.fightCardCondition);
        let newContext = fightAction.createContext(context.player);
        newContext.ignoreHouse = true;
        if (fightAction.meetsRequirements(newContext, ['stunned'])) {
            return false;
        }
        return card.checkRestrictions('use', context) && super.canAffect(card, context);
    }

    checkEventCondition(event) {
        if (event.card.stunned) {
            return true;
        }
        let fightAction = event.card.getFightAction();
        let newContext = fightAction.createContext(event.context.player);
        newContext.ignoreHouse = true;
        return (
            this.canAffect(event.card, event.context) &&
            event.card.checkRestrictions(this.name, newContext)
        );
    }

    getEvent(card, context) {
        return super.createEvent('onInitiateFight', { card, context }, () => {
            let newContext;
            if (card.stunned) {
                let removeStunAction = card
                    .getActions()
                    .find((action) => action.title === "Remove this creature's stun");
                newContext = removeStunAction.createContext(context.player);
            } else {
                let fightAction = card.getFightAction(
                    this.fightCardCondition,
                    this.resolveFightPostHandler,
                    this.ignoreTaunt
                );
                newContext = fightAction.createContext(context.player);
            }

            newContext.canCancel = false;
            context.game.resolveAbility(newContext);
        });
    }
}

module.exports = FightGameAction;
