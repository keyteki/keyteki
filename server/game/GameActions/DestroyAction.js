const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class DestroyAction extends CardGameAction {
    constructor(propertyFactory, isSacrifice = false) {
        super(propertyFactory);
        this.name = isSacrifice ? 'sacrifice' : 'destroy';
        this.effectMsg = isSacrifice ? 'sacrifice {0}' : 'destroy {0}';
    }

    setDefaultProperties() {
        this.damageEvent = null;
    }

    setup() {
        this.targetType = ['creature', 'artifact', 'upgrade'];
    }

    canAffect(card, context) {
        // Tagged-for-destruction cards remain in play until the
        // destroyed-ability window closes, so they should still be visible to
        // selectors and direct-target lookups (e.g. Soulkeeper's "most
        // powerful enemy creature", Soleft's "left-flank creature"). The
        // destroy event itself becomes a no-op for an already-moribund card
        // (see getEvent's `condition`), since the original destruction will
        // move the card to discard once the window closes.
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        const params = {
            card: card,
            context: context,
            damageEvent: this.damageEvent,
            isRedirected: this.damageEvent ? this.damageEvent.isRedirected : false,
            // If the card is already tagged for destruction by an earlier
            // event in this window, this destroy is a no-op.
            // Skipping prevents duplicate "destroyed" messages,
            // duplicate destroyed-ability triggers, and a duplicate
            // leavesPlay sub-event.
            condition: (event) => !event.card.moribund
        };

        const event = super.createEvent(EVENTS.onCardDestroyed, params, (event) => {
            event.card.moribund = true;

            context.game.addMessage('{0} is destroyed', event.card);

            event.leavesPlayEvent = context.game.getEvent(
                EVENTS.onCardLeavesPlay,
                {
                    card: event.card,
                    context: context,
                    condition: (event) => event.card.location === 'play area',
                    triggeringEvent: event,
                    battlelineIndex: event.card.controller.cardsInPlay.indexOf(event.card) - 1,
                    isRedirected: this.damageEvent ? this.damageEvent.isRedirected : false
                },
                (leavesPlayEvent) => {
                    leavesPlayEvent.card.owner.moveCard(event.card, 'discard');
                }
            );

            event.addSubEvent(event.leavesPlayEvent);
        });

        // If this destruction was triggered while resolving destroyed abilities
        // then it should be batched together with them.
        if (context.game.currentDestructionWindow) {
            // Mark this event so we don't open a separate reaction window for it
            event.openReactionWindow = false;
            context.game.currentDestructionWindow.addBatchedDestroyEvent(event);
        }

        return event;
    }
}

module.exports = DestroyAction;
