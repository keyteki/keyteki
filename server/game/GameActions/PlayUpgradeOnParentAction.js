const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class PlayUpgradeOnParentAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'hand';
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

        if (
            !this.parent ||
            this.parent.type !== 'creature' ||
            this.parent.location !== 'play area'
        ) {
            return false;
        }

        return card
            .getActions(this.location)
            .some(
                (action) =>
                    action.title.includes('Play this upgrade') &&
                    this.actionMeetsRequirement(context, action)
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

module.exports = PlayUpgradeOnParentAction;
