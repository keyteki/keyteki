const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class PlayCardAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'hand';
        this.deploy = false;
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

        const playActions = card
            .getActions(this.location)
            .filter((action) => action.title.includes('Play'));

        if (playActions.some((action) => this.actionMeetsRequirement(context, action))) {
            return true;
        }

        // No legal play action. For plays from a hidden zone (i.e. anywhere
        // other than hand), we still need to surface the attempt with a
        // reveal-and-return message when the only thing blocking the play is
        // a restriction on the card itself (e.g. Kelifi Dragon's cardCannot,
        // alpha cost). When the block comes from an external player-level
        // restriction (e.g. Ember Imp, Kaupe via playerCannot), the play
        // fizzles silently so the card is not revealed to the opponent.
        return (
            card.location !== 'hand' &&
            playActions.length > 0 &&
            !this.blockedByPlayerRestriction(context, playActions[0])
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
        return this.canAffect(event.card, event.context);
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
                        handlers: playActions.map(
                            (ability) => () => this.resolveAction(context, ability)
                        ),
                        source: card
                    });
                } else if (playActions.length === 1) {
                    this.resolveAction(context, playActions[0]);
                } else {
                    // Reached only when canAffect allowed a hidden-zone play
                    // blocked solely by a card-self/cost restriction.
                    event.illegalTarget = true;
                    context.game.addMessage(
                        '{0} is unable to play {1} and returns it to {2}',
                        context.player,
                        card,
                        card.location
                    );
                }
            }
        );
    }
}

module.exports = PlayCardAction;
