/**
 * RandomDiscardAction - randomly discard amount of cards from a player's hand,
 * deck, or archives.
 */
const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

class RandomDiscardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        // hand, deck or archives
        this.location = 'hand';
    }

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = `discard ${
            this.amount === 1 ? 'a card' : `${this.amount} cards`
        } at random from {0}'s ${this.location}`;
    }

    canAffect(player, context) {
        if (!player) {
            return false;
        }
        return (
            this.getAmount(player) > 0 &&
            this.getCards(player).length > 0 &&
            super.canAffect(player, context)
        );
    }

    /**
     * Get the amount to discard for a given player.
     * Supports both a static number and a function that takes the player.
     */
    getAmount(player) {
        if (typeof this.amount === 'function') {
            return this.amount(player);
        }
        return this.amount;
    }

    getCards(player) {
        switch (this.location) {
            case 'archives':
                return player.archives;
            case 'deck':
                return player.deck;
            default:
                return player.hand;
        }
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
            let remainingAmount = event.amount;

            const discardNextCard = () => {
                // Check if amount of cards have been discarded
                if (remainingAmount <= 0) {
                    // Done discarding
                    event.cards = cardsDiscarded;
                    return;
                }

                const availableCards = this.getCards(player);
                if (availableCards.length === 0) {
                    // No more cards to discard
                    event.cards = cardsDiscarded;
                    return;
                }

                const randomCard = _.sample(availableCards);
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
                    remainingAmount--;
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

                // If orderForcedAbilities is not enabled, use default order: active player then opponent
                const activePlayer = context.game.activePlayer;
                if (!activePlayer?.optionSettings?.orderForcedAbilities) {
                    const orderedPlayers = [
                        activePlayer,
                        ...players.filter((p) => p !== activePlayer)
                    ];
                    executeDiscards(orderedPlayers);
                    return;
                }

                // Prompt for player order
                const choices = players.map((player) =>
                    player === context.player ? 'Me' : 'Opponent'
                );

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

module.exports = RandomDiscardAction;
