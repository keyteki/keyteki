const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class PlayUpgradeOnParentAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'hand';
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

        if (
            !this.parent ||
            this.parent.type !== 'creature' ||
            this.parent.location !== 'play area'
        ) {
            return false;
        }

        const playActions = card
            .getActions(this.location)
            .filter((action) => action.title.includes('Play this upgrade'));

        if (playActions.some((action) => this.actionMeetsRequirement(context, action))) {
            return true;
        }

        // Hidden-zone play blocked solely by a card-self/cost restriction
        // or by a card-specific player restriction: surface a
        // reveal-and-return message via getEvent. Card-independent
        // player restrictions block without revealing.
        return (
            card.location !== 'hand' &&
            playActions.length > 0 &&
            !this.isBlockedWithoutReveal(card, context)
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
                    action.title.includes('Play this upgrade') &&
                    this.actionMeetsRequirement(context, action)
            );

        return super.createEvent(
            EVENTS.unnamedEvent,
            { card: card, context: context, player: context.player },
            () => {
                if (playActions.length >= 1 && playActions[0].newWithParent) {
                    this.resolveAction(context, playActions[0].newWithParent(this.parent));
                } else {
                    // Reached only when canAffect allowed a hidden-zone play
                    // blocked solely by a card-self/cost restriction.
                    context.game.addMessage(
                        '{0} was unable to be played so is returned to its original location',
                        card
                    );
                }
            }
        );
    }
}

module.exports = PlayUpgradeOnParentAction;
