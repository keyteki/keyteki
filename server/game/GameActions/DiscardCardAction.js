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
        this._orderedByPrompt = true;

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

    getEvent(card, context) {
        let location = card.location;
        return super.createEvent('onCardDiscarded', { card, context, location }, () => {
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
        if (this._orderedByPrompt) {
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
                context.game.getEvent('onOrderedDiscard', { cards: orderedTargets }, () => {
                    // No chat message here; callers like ChosenDiscardAction/RandomDiscardAction already log
                    for (const card of orderedTargets) {
                        const evt = this.getEvent(card, context);
                        context.game.openEventWindow([evt]);
                    }
                })
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

module.exports = DiscardCardAction;
