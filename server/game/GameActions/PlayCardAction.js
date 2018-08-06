const CardGameAction = require('./CardGameAction');
const AbilityResolver = require('../gamesteps/abilityresolver');

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
}

class PlayCardAction extends CardGameAction {
    setDefaultProperties() {
        this.resetOnCancel = false;
        this.postHandler = () => true;
        this.location = 'hand';
        this.action = null;
    }

    setup() {
        this.name = 'play';
        this.targetType = ['character', 'attachment', 'event'];
        this.effectMsg = 'play {0} as if it were in their hand';
    }

    canAffect(card, context) {
        if(!super.canAffect(card, context)) {
            return false;
        } else if(this.action) {
            let newContext = this.action.createContext(context.player);
            return this.action.card === card && !this.action.meetsRequirements(newContext, ['location', 'player']);
        }
        let actions = card.getActions(context.player, this.location);
        return this.getLegalActions(actions, context).length > 0;
    }

    getLegalActions(actions, context) {
        // filter actions to exclude actions which involve this game action, or which are not legal
        return actions.filter(action => {
            let gameActions = action.targets.reduce((array, target) => array.concat(target.properties.gameAction), action.gameAction);
            let newContext = action.createContext(context.player);
            return !gameActions.includes(this) && !action.meetsRequirements(newContext, ['location', 'player']);
        });
    }

    cancelAction(context) {
        this.target = [];
        this.action = null;
        context.ability.executeHandler(context);
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        context.game.queueSimpleStep(() => {
            if(this.target.length > 0 && !this.action) {
                let actions = this.getLegalActions(this.target[0].getActions(context.player, this.location), context);
                if(actions.length === 1) {
                    this.action = actions[0];
                    return;
                }
                context.game.promptWithHandlerMenu(context.player, {
                    source: this.target[0],
                    choices: actions.map(action => action.title).concat(this.resetOnCancel ? 'Cancel' : []),
                    handlers: actions.map(action => () => this.action = action).concat(() => this.cancelAction(context))
                });
            }
        });
    }

    getEventArray(context) {
        return this.action ? super.getEventArray(context) : [];
    }

    getEvent(card, context) {
        let playContext = this.action.createContext(context.player);
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            context.game.queueStep(new PlayCardResolver(context.game, playContext, this, context));
        });
    }
}

module.exports = PlayCardAction;
