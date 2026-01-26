const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

/**
 * DiscardRandomCardsToAmountAction - Discards random cards from a player's hand
 * until they have at most `amount` cards remaining. The active player chooses
 * who discards first if there are multiple targets.
 *
 * Unlike RandomDiscardAction which discards a fixed number of cards, this
 * discards until a threshold is reached. This matters when scrap abilities draw
 * or discard cards.
 */
class DiscardRandomCardsToAmountAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = (player) => player.maxHandSize; // Default to hand limit
    }

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = `discard random cards until {0} has ${this.amount} cards in hand`;
    }

    canAffect(player, context) {
        if (!player) {
            return false;
        }
        return player.hand.length > this.getAmount(player) && super.canAffect(player, context);
    }

    /**
     * Get the target hand size for a given player.
     * Supports both a static number and a function that takes the player.
     */
    getAmount(player) {
        if (typeof this.amount === 'function') {
            return this.amount(player);
        }
        return this.amount;
    }

    getEvent(player, context) {
        return this.getSinglePlayerEvent(player, context);
    }

    getEventArray(context) {
        const validTargets = this.target.filter((player) => this.canAffect(player, context));

        if (validTargets.length === 0) {
            return [];
        }

        if (validTargets.length === 1) {
            return [this.getSinglePlayerEvent(validTargets[0], context)];
        }

        // Multiple players - return an event that prompts for player order then executes
        return [this.getMultiPlayerEvent(validTargets, context)];
    }

    getSinglePlayerEvent(player, context) {
        const amount = this.getAmount(player);

        return super.createEvent(EVENTS.unnamedEvent, { player, context, amount }, (event) => {
            const cardsDiscarded = [];

            const discardNextCard = () => {
                // Check current hand size against target amount
                if (player.hand.length <= amount) {
                    // Done discarding
                    event.cards = cardsDiscarded;
                    return;
                }

                const randomCard = _.sample(player.hand);
                cardsDiscarded.push(randomCard);
                context.game.addMessage('{0} randomly discards {1}', player, randomCard);

                // Create a discard event for this card
                const discardEvent = context.game.actions
                    .discard({ chatMessage: false })
                    .getEvent(randomCard, context);

                // Queue the discard event
                context.game.queueSimpleStep(() => {
                    context.game.openEventWindow([discardEvent]);
                });

                context.game.queueSimpleStep(() => {
                    discardNextCard();
                });
            };

            // Start discarding
            discardNextCard();
        });
    }

    getMultiPlayerEvent(players, context) {
        // Create an event with a player property that passes checkEventCondition
        // We use the first player in the list since at least one must be valid
        return super.createEvent(
            EVENTS.unnamedEvent,
            { player: players[0], players, context },
            () => {
                // Prompt for player order
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
                    activePromptTitle: 'Choose which player discards first',
                    source: context.source,
                    choices: choices,
                    handlers: handlers
                });
            }
        );
    }
}

module.exports = DiscardRandomCardsToAmountAction;
