const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

const locationsHiddenFromPurge = ['hand', 'archives'];

class PurgeAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'purge';
        this.effectMsg = 'purge {0}';
    }

    setDefaultProperties() {
        this.purgedBy = null;
    }

    canAffect(target, context) {
        if (context.source === target && locationsHiddenFromPurge.includes(target.location)) {
            return false;
        }
        return this.targetType.includes(target.type);
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        // Handle gigantic creatures from onCardPlaced events (e.g., Annihilation Ritual)
        // If the event has giganticOtherHalf, automatically include both halves
        if (
            this.target.length === 1 &&
            context.event?.giganticOtherHalf &&
            this.target[0] === context.event.card
        ) {
            this.setTarget([context.event.card, context.event.giganticOtherHalf]);
            return;
        }

        // Handle gigantic creatures that were destroyed from play and went to discard.
        // Only prompt for selection if the creature was previously composed (wasComposed flag).
        // This handles the case where a card effect destroys a gigantic creature
        // and then purges it - we need to ask which half to purge.
        if (this.target.length === 1) {
            const card = this.target[0];
            if (
                card.gigantic &&
                card.location === 'discard' &&
                !card.composedPart &&
                card.wasComposed
            ) {
                // Find the other half in the same discard pile
                const otherHalf = card.owner.discard.find(
                    (c) => c.id === card.compositeId && c !== card
                );

                if (otherHalf) {
                    // Card was destroyed from play while composed, prompt for which half to purge
                    this.target = [];
                    context.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Choose which half to purge',
                        context: context,
                        cards: [card, otherHalf],
                        cardHandler: (selectedCard) => {
                            this.setTarget(selectedCard);
                            context.game.queueSimpleStep(() => {
                                let event = this.getEvent(selectedCard, context);
                                context.game.openEventWindow(event);
                            });
                        }
                    });
                }
            }
            // If wasComposed is false/undefined, just purge the targeted card
            // (e.g., Hamstrung discarding from deck where halves were never composed)
        }
    }

    purge(card) {
        let composedPart = card.gigantic ? card.composedPart : null;
        card.owner.moveCard(card, 'purged');

        if (this.purgedBy) {
            this.purgedBy.purgedCards.push(card);
            card.purgedBy = this.purgedBy;
            if (composedPart) {
                this.purgedBy.purgedCards.push(composedPart);
                composedPart.purgedBy = this.purgedBy;
            }
        }
    }

    getEvent(card, context) {
        // Snapshot the origin location at event creation time so that the
        // abduct replacement decision (below) is fixed by the rules-intent
        // "when this card would be purged from archives" — not by where the
        // card may end up if an intervening effect moves it before this
        // event resolves.
        const location = card.location;
        const event = super.createEvent(
            EVENTS.onCardPurged,
            { card: card, context: context, replaced: false },
            () => {
                // Abduct replacement: uses the captured origin location so a
                // card pulled out of archives by another effect in the same
                // window still gets redirected to hand as the rules require.
                if (location === 'archives' && card.abducted) {
                    card.controller.moveCard(card, 'purged');
                    event.replaced = true;
                    return;
                }

                // onCardLeavesPlay uses the current location: only fire it if
                // the card is still in play at resolution time, since an
                // earlier effect in the same window may have already moved
                // it out (and raised onCardLeavesPlay then).
                if (card.location === 'play area') {
                    event.leavesPlayEvent = context.game.getEvent(
                        EVENTS.onCardLeavesPlay,
                        { card, context },
                        () => this.purge(card)
                    );
                    event.addSubEvent(event.leavesPlayEvent);
                } else {
                    this.purge(card);
                }
            }
        );
        return event;
    }
}

module.exports = PurgeAction;
