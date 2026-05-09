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

    update(context) {
        super.update(context);
        // Suppress the standard "uses {source} to play {target}" effectMsg
        // when every target is blocked by a card-independent player-level
        // restriction (e.g. Ember Imp), since revealing the card name
        // would leak hidden information. The generic "unable to play a
        // card from {location}" message is emitted by getEvent instead.
        // Card-specific restrictions (Quixxle Stone, Traumatic Echo) and
        // card-self/cost restrictions (Kelifi Dragon, alpha) still reveal
        // the card via the standard messaging flow.
        this.defersMessage =
            this.target.length > 0 &&
            this.target.every(
                (target) =>
                    target.location !== 'hand' &&
                    !this.hasLegalPlayAction(target, context) &&
                    this.isBlockedWithoutReveal(target, context)
            );
    }

    canAffect(card, context) {
        if (!super.canAffect(card, context)) {
            return false;
        }

        if (this.hasLegalPlayAction(card, context)) {
            return true;
        }

        // No legal play action. For plays from a hidden zone we still
        // surface the attempt so getEvent can emit an appropriate message.
        return card.location !== 'hand' && this.getPlayActions(card).length > 0;
    }

    getPlayActions(card) {
        return card.getActions(this.location).filter((action) => action.title.includes('Play'));
    }

    hasLegalPlayAction(card, context) {
        return this.getPlayActions(card).some((action) =>
            this.actionMeetsRequirement(context, action)
        );
    }

    isBlockedWithoutReveal(card, context) {
        // A card-independent player-level restriction (e.g. Ember Imp's
        // per-turn play limit) blocks the play without inspecting the
        // card, so we can block without revealing it. Card-specific
        // restrictions inspect the card's identity and so the card must
        // be revealed before the block can be known.
        const playActions = this.getPlayActions(card);
        if (playActions.length === 0) {
            return false;
        }
        const actionContext = playActions[0].createContext(context.player);
        actionContext.ignoreHouse = true;
        if (actionContext.player.checkRestrictions('play', actionContext)) {
            return false;
        }
        return context.player.effects.some((effect) => {
            if (effect.type !== 'abilityRestrictions') {
                return false;
            }
            const restriction = effect.getValue && effect.getValue(context.player);
            return (
                restriction &&
                !restriction.condition &&
                restriction.checkRestriction('play', actionContext, null, effect.context)
            );
        });
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
        let playActions = this.getPlayActions(card).filter((action) =>
            this.actionMeetsRequirement(context, action)
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
                    event.illegalTarget = true;
                    if (this.isBlockedWithoutReveal(card, context)) {
                        context.game.addMessage(
                            '{0} is unable to play a card from {1} due to a restriction',
                            context.player,
                            card.location
                        );
                    } else {
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
