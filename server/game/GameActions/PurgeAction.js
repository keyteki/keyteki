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
        let location = card.location;
        const event = super.createEvent(
            EVENTS.onCardPurged,
            { card: card, context: context, replaced: false },
            () => {
                // Abduct replacement effect: abducted cards go to owner's hand instead of purge
                if (location === 'archives' && card.abducted) {
                    context.game.addMessage(
                        "{0} leaves {1}'s archives and is added to {2}'s hand instead of being purged",
                        card,
                        card.controller,
                        card.owner
                    );
                    card.abducted = false;
                    // moveCard must be called before changing controller, as it uses
                    // controller to find which pile to remove the card from
                    card.controller.moveCard(card, 'hand');
                    event.replaced = true;
                    return;
                }

                if (card.location === 'play area') {
                    context.game.raiseEvent(EVENTS.onCardLeavesPlay, { card, context }, () =>
                        this.purge(card)
                    );
                } else {
                    this.purge(card);
                }
            }
        );
        return event;
    }
}

module.exports = PurgeAction;
