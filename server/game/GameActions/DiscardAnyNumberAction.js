const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');

/**
 * "Discard any number of cards from your hand."
 *
 * Cards are discarded one at a time. If any eligible card has a "Scrap:"
 * ability (which may change the hand mid-discard, e.g. by drawing), the player
 * first chooses how many cards to discard, then picks each card in turn from
 * their current hand, so newly drawn cards are eligible. Otherwise the player
 * picks all the cards at once.
 *
 * Resolves as an `onOrderedDiscard` event, so use
 * `DiscardCardAction.collectDiscardedCards(context.preThenEvents)` to count the
 * cards "discarded this way".
 */
class DiscardAnyNumberAction extends PlayerAction {
    setDefaultProperties() {
        this.cardCondition = () => true;
    }

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = 'discard any number of cards';
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return (
            this.getEligibleCards(player, context).length > 0 && super.canAffect(player, context)
        );
    }

    getEligibleCards(player, context) {
        return player.hand.filter((card) => this.cardCondition(card, context));
    }

    hasScrap(card) {
        return card.abilities.reactions.some((ability) => ability.properties.scrap);
    }

    discardCards(cards, event, context) {
        context.game.addMessage(
            '{0} uses {1} to discard {2}',
            context.player,
            context.source,
            cards
        );
        for (const card of cards) {
            context.game.queueSimpleStep(() => {
                if (card.location !== 'hand') {
                    return;
                }

                const discardEvent = context.game.actions
                    .discard({ chatMessage: false })
                    .getEvent(card, context);
                event.discardEvents.push(discardEvent);
                context.game.openEventWindow([discardEvent]);
            });
        }
    }

    promptForCards(player, event, context) {
        context.game.promptForSelect(context.game.activePlayer, {
            context: context,
            controller: player === context.player ? 'self' : 'opponent',
            location: 'hand',
            mode: 'unlimited',
            optional: true,
            cardCondition: (card) => this.cardCondition(card, context),
            onSelect: (_, cards) => {
                if (cards.length > 0) {
                    this.discardCards(cards, event, context);
                }

                return true;
            }
        });
    }

    promptForNextCard(player, remaining, event, context) {
        if (remaining <= 0 || this.getEligibleCards(player, context).length === 0) {
            return;
        }

        context.game.promptForSelect(context.game.activePlayer, {
            activePromptTitle: 'Choose a card to discard',
            context: context,
            controller: player === context.player ? 'self' : 'opponent',
            location: 'hand',
            cardCondition: (card) => this.cardCondition(card, context),
            onSelect: (_, card) => {
                this.discardCards([card], event, context);
                context.game.queueSimpleStep(() =>
                    this.promptForNextCard(player, remaining - 1, event, context)
                );
                return true;
            }
        });
    }

    getEvent(player, context) {
        return super.createEvent(
            EVENTS.onOrderedDiscard,
            { player, context, discardEvents: [] },
            (event) => {
                const eligibleCards = this.getEligibleCards(player, context);
                if (!eligibleCards.some((card) => this.hasScrap(card))) {
                    this.promptForCards(player, event, context);
                    return;
                }

                // 'All Cards' keeps discarding while eligible cards remain, including any
                // drawn by Scrap: abilities along the way
                const amounts = Array.from({ length: eligibleCards.length + 1 }, (_, i) => i);
                context.game.promptWithHandlerMenu(context.game.activePlayer, {
                    activePromptTitle: 'Choose a number',
                    context: context,
                    choices: amounts.map((amount) => amount.toString()).concat('All Cards'),
                    handlers: amounts
                        .map(
                            (amount) => () => this.promptForNextCard(player, amount, event, context)
                        )
                        .concat(() => this.promptForNextCard(player, Infinity, event, context))
                });
            }
        );
    }
}

module.exports = DiscardAnyNumberAction;
