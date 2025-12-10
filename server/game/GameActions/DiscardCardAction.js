const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class DiscardCardAction extends CardGameAction {
    preEventHandler(context) {
        super.preEventHandler(context);

        // Only prompt for ordering when:
        // - More than one card is being discarded
        // - At least one of those cards has a Scrap reaction
        // - Discards are from hand on the active player's turn
        // - Player has enabled ordering of simultaneous abilities
        if (!this.target || this.target.length <= 1) {
            return;
        }

        const activePlayer = context.game.activePlayer;
        if (!activePlayer || !activePlayer.optionSettings?.orderForcedAbilities) {
            return;
        }

        const isScrapCard = (card) =>
            Array.isArray(card?.abilities?.reactions) &&
            card.abilities.reactions.some((ability) => ability?.properties?.scrap);

        // Only consider cards discarded from hand by the active player
        const handDiscards = this.target.filter(
            (card) => card.location === 'hand' && card.controller === activePlayer
        );

        if (handDiscards.length <= 1) {
            return;
        }

        const hasAnyScrap = handDiscards.some((card) => isScrapCard(card));
        if (!hasAnyScrap) {
            return;
        }

        // Prompt the player to choose the order to discard by clicking cards,
        // until there are no remaining cards with Scrap abilities.
        this._remainingDiscardCards = this.target.slice();
        this._orderedDiscardCards = [];
        this._orderedDiscardFromHandByPrompt = true;

        const promptForDiscardOrder = () => {
            const stillHasScrapToOrder = this._remainingDiscardCards.some(
                (card) => handDiscards.includes(card) && isScrapCard(card)
            );

            if (!stillHasScrapToOrder) {
                // Finalize order: chosen cards first, then any remaining in their current order
                this.setTarget(this._orderedDiscardCards.concat(this._remainingDiscardCards));
                return;
            }

            context.game.promptForSelect(activePlayer, {
                activePromptTitle: 'Select next card to discard',
                context: context,
                location: 'hand',
                cardCondition: (card) => this._remainingDiscardCards.includes(card),
                onSelect: (player, card) => {
                    this._orderedDiscardCards.push(card);
                    this._remainingDiscardCards = this._remainingDiscardCards.filter(
                        (c) => c !== card
                    );
                    promptForDiscardOrder();
                    return true;
                }
            });
        };

        promptForDiscardOrder();
    }
    setup() {
        super.setup();
        this.cost = 'discarding {0}';
    }

    setDefaultProperties() {
        this.chatMessage = true;
    }

    canAffect(card, context) {
        if (this._orderedDiscardFromHandByPrompt && card.location !== 'hand') {
            // If we’re doing an ordered discard from hand, it means that
            // “Scrap:” effects may be going off which can perhaps cause cards
            // to get discarded (see Hazard Zerp).
            //
            // We therefore need to check that the card that was previously
            // chosen to be discarded is still in fact in the player’s hand
            // before we allow the event to resolve.
            //
            // Without this, discarding a card with Hazard Zerp while a full
            // hand discard is happening will lead to that card getting
            // discarded twice, which would trigger any “Scrap:” effect it had
            // twice.
            //
            // See: https://github.com/keyteki/keyteki/issues/4663

            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let location = card.location;
        return super.createEvent(EVENTS.onCardDiscarded, { card, context, location }, () => {
            if (card.location === 'hand') {
                context.game.cardDiscarded(card);
            }

            card.owner.moveCard(card, 'discard');
        });
    }

    getEventArray(context) {
        if (!this.target || this.target.length === 0) {
            return [];
        }

        // If the target order was established via prompt, resolve discards sequentially in that order
        if (this._orderedDiscardFromHandByPrompt) {
            const orderedTargets = this.target.filter((t) => this.canAffect(t, context));

            if (orderedTargets.length > 0 && this.chatMessage) {
                context.game.addMessage(
                    '{0} uses {1} to discard {2}',
                    context.player,
                    context.source,
                    this.target
                );
            }

            return [
                context.game.getEvent(
                    EVENTS.onOrderedDiscard,
                    { cards: orderedTargets, discardEvents: [] },
                    (event) => {
                        // No chat message here; callers like ChosenDiscardAction/RandomDiscardAction already log
                        for (const card of orderedTargets) {
                            const evt = this.getEvent(card, context);
                            event.discardEvents.push(evt);
                            context.game.openEventWindow([evt]);
                        }
                    }
                )
            ];
        }

        const events = this.target
            .filter((target) => this.canAffect(target, context))
            .map((card) => this.getEvent(card, context));
        if (events.length > 0 && this.chatMessage) {
            context.game.addMessage(
                '{0} uses {1} to discard {2}',
                context.player,
                context.source,
                this.target
            );
        }
        return events;
    }
}

/**
 * Function that, given an array of `preThenEvents` that one would get in a
 * context inside of a `then` handler, returns cards actually discarded from
 * those events.  Use this for effects that do things “for each card discarded
 * this way” so that you get the right number of iterations.
 *
 * Handles when discards are from “normal” `onCardDiscarded` events as well as
 * when, due to “Scrap:” effects, they come nested from an `onOrderedDiscard`
 * event.
 *
 * Checks to make sure the discard events resolved successfully before including
 * their cards.
 *
 * @param {Event[]} preThenEvents
 */
DiscardCardAction.collectDiscardedCards = function (preThenEvents) {
    const successfullyDiscardedCards = preThenEvents
        // Flatten the `onOrderedDiscard` events to their children, which will
        // be `onCardDiscarded` events.
        .flatMap((ev) => (ev.name === EVENTS.onOrderedDiscard ? ev.discardEvents : [ev]))
        // We expect the events to be `onCardDiscarded`
        // anyway, but this ensures it.
        .filter((ev) => ev.name === EVENTS.onCardDiscarded)
        // Check for resolved because some of the
        // `onCardDiscarded` events initially created by
        // `onOrderedDiscard` may have fizzled if a “Scrap:”
        // effect discarded them early.
        .filter((ev) => ev.resolved)
        .map((ev) => ev.card);

    return successfullyDiscardedCards;
};

module.exports = DiscardCardAction;
