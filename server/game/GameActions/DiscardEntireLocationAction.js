const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

/**
 * DiscardEntireLocationAction - Discards all cards from a player's hand or
 * archives, prompting the active player to choose which player discards first.
 *
 * For the active player: prompts to choose the order of discard if there are
 * scrap effects to resolve. For opponent: discards randomly one at a time since
 * active player makes choices but can't see opponent's cards.
 *
 * Discards until the location is empty, so if a scrap effect draws a card, that
 * card also gets discarded.
 */
class DiscardEntireLocationAction extends PlayerAction {
    setDefaultProperties() {
        this.location = 'hand'; // 'hand' or 'archives'
    }

    getCards(player) {
        switch (this.location) {
            case 'archives':
                return player.archives;
            default:
                return player.hand;
        }
    }

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = `discard {0}'s ${this.location}`;
    }

    canAffect(player, context) {
        if (!player) {
            return false;
        }
        return this.getCards(player).length > 0 && super.canAffect(player, context);
    }

    getEventArray(context) {
        const validTargets = this.target.filter((player) => this.canAffect(player, context));

        if (validTargets.length === 0) {
            return [];
        }

        if (validTargets.length === 1) {
            return [this.getSinglePlayerEvent(validTargets[0], context)];
        }

        // Multiple players - return an event that prompts for order then executes
        return [this.getMultiPlayerEvent(validTargets, context)];
    }

    getMultiPlayerEvent(players, context) {
        const self = this;
        return super.createEvent(
            EVENTS.unnamedEvent,
            { player: players[0], players, context },
            () => {
                const choices = players.map((player) =>
                    player === context.player ? 'Me' : 'Opponent'
                );

                const executeDiscards = (orderedPlayers) => {
                    const processNextPlayer = (remainingPlayers) => {
                        if (remainingPlayers.length === 0) {
                            return;
                        }

                        const player = remainingPlayers[0];
                        const restPlayers = remainingPlayers.slice(1);

                        const playerEvent = self.getSinglePlayerEvent(player, context);

                        context.game.queueSimpleStep(() => {
                            context.game.openEventWindow([playerEvent]);
                        });

                        context.game.queueSimpleStep(() => {
                            processNextPlayer(restPlayers);
                        });
                    };

                    processNextPlayer(orderedPlayers);
                };

                const handlers = players.map((player) => () => {
                    const orderedPlayers = [player, ...players.filter((p) => p !== player)];
                    executeDiscards(orderedPlayers);
                });

                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: `Choose which player discards their ${this.location} first`,
                    source: context.source,
                    choices: choices,
                    handlers: handlers
                });
            }
        );
    }

    getSinglePlayerEvent(player, context) {
        const self = this;
        const isActivePlayer = player === context.game.activePlayer;

        // Use onOrderedDiscard event type so DiscardCardAction.collectDiscardedCards works
        return super.createEvent(
            EVENTS.onOrderedDiscard,
            { player, context, discardEvents: [] },
            (event) => {
                const cardsDiscarded = [];

                if (isActivePlayer) {
                    // Active player chooses discard order
                    self.discardActivePlayerLocation(player, context, cardsDiscarded, event);
                } else {
                    // Opponent discards randomly one at a time
                    self.discardOpponentLocation(player, context, cardsDiscarded, event);
                }
            }
        );
    }

    /**
     * Active player chooses discard order - prompts to select cards one at a time
     */
    discardActivePlayerLocation(player, context, cardsDiscarded, event) {
        const self = this;
        // Track cards that were logged individually (for scrap ordering)
        const cardsLoggedIndividually = [];

        const discardNextCard = () => {
            const cards = self.getCards(player);
            if (cards.length === 0) {
                // Done discarding
                event.cards = cardsDiscarded;
                // Only log cards that weren't already logged individually
                const cardsToLog = cardsDiscarded.filter(
                    (c) => !cardsLoggedIndividually.includes(c)
                );
                if (cardsToLog.length > 0) {
                    context.game.addMessage(
                        "{0} discards {1} from {0}'s " + self.location,
                        player,
                        cardsToLog
                    );
                }
                return;
            }

            // Check if any cards have scrap abilities
            const hasScrapAbility = (card) =>
                Array.isArray(card?.abilities?.reactions) &&
                card.abilities.reactions.some((ability) => ability?.properties?.scrap);

            const locationHasScrap = cards.some((card) => hasScrapAbility(card));

            if (!locationHasScrap || cards.length === 1) {
                // No scrap abilities or only one card - just discard all remaining
                const remainingCards = cards.slice();
                cardsDiscarded.push(...remainingCards);

                const discardEvents = remainingCards.map((card) =>
                    context.game.actions.discard({ chatMessage: false }).getEvent(card, context)
                );

                // Track these events for collectDiscardedCards
                event.discardEvents.push(...discardEvents);

                context.game.queueSimpleStep(() => {
                    context.game.openEventWindow(discardEvents);
                });

                context.game.queueSimpleStep(() => {
                    event.cards = cardsDiscarded;
                    // Only log cards that weren't already logged individually
                    const cardsToLog = cardsDiscarded.filter(
                        (c) => !cardsLoggedIndividually.includes(c)
                    );
                    if (cardsToLog.length > 0) {
                        context.game.addMessage(
                            "{0} discards {1} from {0}'s " + self.location,
                            player,
                            cardsToLog
                        );
                    }
                });
                return;
            }

            // Prompt to select next card to discard
            context.game.promptForSelect(player, {
                activePromptTitle: 'Select next card to discard',
                source: context.source,
                context: context,
                location: self.location,
                controller: 'self',
                onSelect: (p, card) => {
                    cardsDiscarded.push(card);
                    cardsLoggedIndividually.push(card);

                    // Log the discard immediately so it appears before scrap effects
                    context.game.addMessage(
                        "{0} discards {1} from {0}'s " + self.location,
                        player,
                        card
                    );

                    const discardEvent = context.game.actions
                        .discard({ chatMessage: false })
                        .getEvent(card, context);

                    // Track for collectDiscardedCards
                    event.discardEvents.push(discardEvent);

                    context.game.queueSimpleStep(() => {
                        context.game.openEventWindow([discardEvent]);
                    });

                    context.game.queueSimpleStep(() => {
                        discardNextCard();
                    });

                    return true;
                }
            });
        };

        discardNextCard();
    }

    /**
     * Opponent's location is discarded randomly one at a time
     */
    discardOpponentLocation(player, context, cardsDiscarded, event) {
        const self = this;

        const discardNextCard = () => {
            const cards = self.getCards(player);
            if (cards.length === 0) {
                // Done discarding
                event.cards = cardsDiscarded;
                if (cardsDiscarded.length > 0) {
                    context.game.addMessage(
                        '{0} randomly discards {1} from {2}',
                        player,
                        cardsDiscarded,
                        self.location
                    );
                }
                return;
            }

            const randomCard = _.sample(cards);
            cardsDiscarded.push(randomCard);

            const discardEvent = context.game.actions
                .discard({ chatMessage: false })
                .getEvent(randomCard, context);

            // Track for collectDiscardedCards
            event.discardEvents.push(discardEvent);

            context.game.queueSimpleStep(() => {
                context.game.openEventWindow([discardEvent]);
            });

            context.game.queueSimpleStep(() => {
                discardNextCard();
            });
        };

        discardNextCard();
    }

    getEvent(player, context) {
        return this.getSinglePlayerEvent(player, context);
    }
}

module.exports = DiscardEntireLocationAction;
