import CardGameAction from './CardGameAction.js';

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

    getEvent(card, context) {
        let playActions = card
            .getActions(this.location)
            .filter(
                (action) =>
                    action.title.includes('Play') && this.actionMeetsRequirement(context, action)
            );

        return super.createEvent(
            'playCardEvent',
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
                            '{0} was unable to be played so is returned to its original location',
                            card
                        );
                    }
                }
            }
        );
    }
}

export default PlayCardAction;
