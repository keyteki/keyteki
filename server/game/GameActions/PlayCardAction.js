const CardGameAction = require('./CardGameAction');

class PlayCardAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'hand';
    }

    setup() {
        super.setup();
        this.name = 'play';
        this.effectMsg = 'play {0}';
    }

    canAffect(card, context) {
        if(!super.canAffect(card, context)) {
            return false;
        }

        let actions = card.getActions(this.location).filter(action => action.title.includes('Play'));
        return !!actions.find(action => {
            let actionContext = action.createContext(context.player);
            actionContext.ignoreHouse = true;
            return !action.meetsRequirements(actionContext, ['location']);
        });
    }

    getEvent(card, context) {
        let action = card.getActions(this.location).find(action => action.title.includes('Play'));
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            let actionContext = action.createContext(context.player);
            actionContext.ignoreHouse = true;
            context.game.resolveAbility(actionContext);
        });
    }
}

module.exports = PlayCardAction;
