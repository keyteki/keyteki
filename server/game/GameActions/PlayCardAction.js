const CardGameAction = require('./CardGameAction');
//const AbilityResolver = require('../gamesteps/abilityresolver');

/*
class PlayCardResolver extends AbilityResolver {
    constructor(game, context, playGameAction, gameActionContext) {
        super(game, context);
        this.playGameAction = playGameAction;
        this.gameActionContext = gameActionContext;
        this.cancelPressed = false;
    }

    payCosts() {
        if((this.cancelled || this.canPayResults.cancelled) && this.playGameAction.resetOnCancel) {
            this.playGameAction.cancelAction(this.gameActionContext);
            this.cancelPressed = true;
        }
        super.payCosts();
    }

    initiateAbility() {
        super.initiateAbility();
        if(!this.cancelPressed) {
            this.game.queueSimpleStep(() => this.playGameAction.postHandler(this.context.source));
        }
    }
}*/

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
        return actions.find(action => {
            let actionContext = action.createContext(context.player);
            actionContext.ignoreHouse = true;
            return !action.meetsRequirements(actionContext, ['location']);
        });
    }

    getEvent(card, context) {
        let action = card.getActions(this.location).find(action => action.title.includes('Play'));
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            context.game.resolveAbility(action.createContext(context.player));
        });
    }
}

module.exports = PlayCardAction;
