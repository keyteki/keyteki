const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class PlayCardAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'hand';
        this.deploy = false;
        this.revealOnIllegalTarget = false;
    }

    setup() {
        super.setup();
        this.name = 'play';
        this.effectMsg = 'play {0}';
    }

    canAffect(card, context) {
        if (!super.canAffect(card, context)) {
            return false;
        }

        if (this.revealOnIllegalTarget) {
            return true;
        }

        return card
            .getActions(this.location)
            .some(
                (action) =>
                    action.title.includes('Play') && this.actionMeetsRequirement(context, action)
            );
    }

    actionMeetsRequirement(context, action) {
        let actionContext = action.createContext(context.player);
        actionContext.ignoreHouse = true;
        return !action.meetsRequirements(actionContext, ['location']);
    }

    resolveAction(context, action) {
        action.deploy = this.deploy;
        let actionContext = action.createContext(context.player);
        actionContext.ignoreHouse = true;
        context.game.resolveAbility(actionContext);
    }

    checkEventCondition(event) {
        if (!this.canAffect(event.card, event.context)) {
            return false;
        }

        // Find the play actions for the card and create proper contexts for them.
        // We need to use the play action's context (with the card being played as
        // the source) rather than the event context (which has the card that
        // triggered the PlayCardAction as the source, e.g. Wild Wormhole).
        let playActions = event.card
            .getActions(this.location)
            .filter((action) => action.title.includes('Play'));

        const hasValidPlayAction = playActions.some((action) =>
            this.actionMeetsRequirement(event.context, action)
        );

        // If revealOnIllegalTarget is true, allow the event to proceed even without valid play actions
        // so we can show an appropriate message
        return hasValidPlayAction || this.revealOnIllegalTarget;
    }

    getEvent(card, context) {
        let playActions = card
            .getActions(this.location)
            .filter(
                (action) =>
                    action.title.includes('Play') && this.actionMeetsRequirement(context, action)
            );

        return super.createEvent(
            EVENTS.playCardEvent,
            { card: card, context: context, player: context.player },
            (event) => {
                if (playActions.length > 1) {
                    context.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Play ' + card.name + ':',
                        choices: playActions.map((ability) => ability.title),
                        handlers: playActions.map((ability) => () =>
                            this.resolveAction(context, ability)
                        ),
                        source: card
                    });
                } else if (playActions.length === 1) {
                    this.resolveAction(context, playActions[0]);
                } else {
                    event.illegalTarget = true;
                    if (this.revealOnIllegalTarget) {
                        context.game.addMessage(
                            '{0} is unable to play {1} and returns it to {2}',
                            context.player,
                            card,
                            card.location
                        );
                    }
                }
            }
        );
    }
}

module.exports = PlayCardAction;
