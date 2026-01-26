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

    // Get the target hand size for a given player.
    // Supports both a static number and a function that takes the player.
    getAmount(player) {
        if (typeof this.amount === 'function') {
            return this.amount(player);
        }
        return this.amount;
    }

    setup() {
        super.setup();
        this.name = 'discard';
    }

    canAffect(player, context) {
        if (!player) {
            return false;
        }
        const targetAmount = this.getAmount(player);
        return player.hand.length > targetAmount && super.canAffect(player, context);
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
                    activePromptTitle: 'Choose which player discards first',
                    source: context.source,
                    choices: choices,
                    handlers: handlers
                });
            }
        );
    }

    getSinglePlayerEvent(player, context) {
        const targetAmount = this.getAmount(player);

        return super.createEvent(
            EVENTS.unnamedEvent,
            { player, context, targetAmount },
            (event) => {
                const cardsDiscarded = [];

                const discardNextCard = () => {
                    // Check current hand size against target
                    if (player.hand.length <= targetAmount) {
                        // Done discarding
                        event.cards = cardsDiscarded;
                        return;
                    }

                    const randomCard = _.sample(player.hand);
                    cardsDiscarded.push(randomCard);
                    context.game.addMessage('{0} randomly discards {1}', player, randomCard);

                    const discardEvent = context.game.actions
                        .discard({ chatMessage: false })
                        .getEvent(randomCard, context);

                    context.game.queueSimpleStep(() => {
                        context.game.openEventWindow([discardEvent]);
                    });

                    context.game.queueSimpleStep(() => {
                        discardNextCard();
                    });
                };

                discardNextCard();
            }
        );
    }

    getEvent(player, context) {
        return this.getSinglePlayerEvent(player, context);
    }
}

module.exports = DiscardRandomCardsToAmountAction;
