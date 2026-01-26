const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

/**
 * DiscardEntireLocationAction - Discards all cards from a player's hand or
 * archives, prompting the active player to choose which player discards first.
 *
 * For the active player: prompts to choose the order of discard if there are
 * scrap effects to resolve. For opponent: discards randomly one at a time since
 * active player makes all choices but can't see opponent's cards.
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

    getSinglePlayerEvent(player, context) {
        // Use onOrderedDiscard event type so DiscardCardAction.collectDiscardedCards works
        return super.createEvent(
            EVENTS.onOrderedDiscard,
            { player, context, discardEvents: [] },
            (event) => {
                const cardsDiscarded = [];
                if (player === context.game.activePlayer) {
                    // Active player chooses discard order
                    this.discardActivePlayerLocation(player, context, cardsDiscarded, event);
                } else {
                    // Opponent discards randomly one at a time
                    this.discardOpponentLocation(player, context, cardsDiscarded, event);
                }
            }
        );
    }

    getMultiPlayerEvent(players, context) {
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
                        const playerEvent = this.getSinglePlayerEvent(player, context);

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
                    activePromptTitle: `Choose which player discards first`,
                    source: context.source,
                    choices: choices,
                    handlers: handlers
                });
            }
        );
    }

    // Active player chooses discard order - prompts to select cards one at a time
    discardActivePlayerLocation(player, context, cardsDiscarded, event) {
        const discardNextCard = () => {
            const cards = this.getCards(player);
            if (cards.length === 0) {
                // Done discarding
                event.cards = cardsDiscarded;
                return;
            }

            // If only one card left, discard it without prompting
            if (cards.length === 1) {
                const card = cards[0];
                cardsDiscarded.push(card);
                context.game.addMessage('{0} discards {1} from {2}', player, card, this.location);

                const discardEvent = context.game.actions
                    .discard({ chatMessage: false })
                    .getEvent(card, context);

                event.discardEvents.push(discardEvent);
                context.game.queueSimpleStep(() => {
                    context.game.openEventWindow([discardEvent]);
                });

                context.game.queueSimpleStep(() => {
                    discardNextCard();
                });
                return;
            }

            // Prompt to select next card to discard
            context.game.promptForSelect(player, {
                activePromptTitle: 'Select next card to discard',
                buttons: [{ text: 'Autoresolve', arg: 'autoresolve' }],
                context: context,
                controller: 'self',
                location: this.location,
                onMenuCommand: (p, arg) => {
                    if (arg === 'autoresolve') {
                        // Switch to random discarding for remaining cards
                        this.discardRemainingRandomly(player, context, cardsDiscarded, event);
                        return true;
                    }
                    return false;
                },
                onSelect: (p, card) => {
                    cardsDiscarded.push(card);
                    context.game.addMessage(
                        '{0} discards {1} from {2}',
                        player,
                        card,
                        this.location
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
                },
                source: context.source
            });
        };

        discardNextCard();
    }

    // Discard remaining cards randomly (used when player clicks Autoresolve)
    discardRemainingRandomly(player, context, cardsDiscarded, event) {
        const discardNextCard = () => {
            const cards = this.getCards(player);
            if (cards.length === 0) {
                // Done discarding
                event.cards = cardsDiscarded;
                return;
            }

            const randomCard = _.sample(cards);
            cardsDiscarded.push(randomCard);
            context.game.addMessage('{0} discards {1} from {2}', player, randomCard, this.location);

            const discardEvent = context.game.actions
                .discard({ chatMessage: false })
                .getEvent(randomCard, context);

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

    // Opponent's location is discarded randomly one at a time
    discardOpponentLocation(player, context, cardsDiscarded, event) {
        const discardNextCard = () => {
            const cards = this.getCards(player);
            if (cards.length === 0) {
                // Done discarding
                event.cards = cardsDiscarded;
                return;
            }

            const randomCard = _.sample(cards);
            cardsDiscarded.push(randomCard);
            context.game.addMessage(
                '{0} randomly discards {1} from {2}',
                player,
                randomCard,
                this.location
            );

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
