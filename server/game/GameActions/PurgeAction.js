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

        // Handle gigantic creatures that have been separated in discard. If a
        // single gigantic card is targeted but is now in discard without its
        // composedPart, and the other half is also in discard, prompt for which
        // half to purge. This handles the case where a card effect purges a
        // creature that was destroyed and separated into two cards in the
        // discard pile.
        if (this.target.length === 1) {
            const card = this.target[0];
            if (
                card.gigantic &&
                card.location === 'discard' &&
                !card.composedPart &&
                card.compositeId
            ) {
                // Find the other half in the same discard pile
                const otherHalf = card.owner.discard.find(
                    (c) => c.id === card.compositeId && c !== card
                );

                if (otherHalf) {
                    // Both halves are in discard, prompt for selection
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
        return super.createEvent(EVENTS.onCardPurged, { card: card, context: context }, () => {
            if (card.location === 'play area') {
                context.game.raiseEvent(EVENTS.onCardLeavesPlay, { card, context }, () =>
                    this.purge(card)
                );
            } else {
                this.purge(card);
            }
        });
    }
}

module.exports = PurgeAction;
