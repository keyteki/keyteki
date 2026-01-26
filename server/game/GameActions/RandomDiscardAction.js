const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

class RandomDiscardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        // hand, deck or archives
        this.location = 'hand';
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

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg =
            'discard ' +
            (this.amount === 1 ? 'a card' : `${this.amount} cards`) +
            ` at random from {0}'s ${this.location}`;
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
        const amount = this.getAmount(player);
        return super.createEvent(EVENTS.unnamedEvent, { player, context, amount }, (event) => {
            const cardsDiscarded = [];
            let remainingAmount = event.amount;

            // Create a recursive function to discard cards one at a time
            const discardNextCard = () => {
                if (remainingAmount <= 0) {
                    // Done discarding
                    event.cards = cardsDiscarded;
                    if (cardsDiscarded.length > 0) {
                        context.game.addMessage(
                            '{0} randomly discards {1}',
                            player,
                            cardsDiscarded
                        );
                    }
                    return;
                }

                const availableCards = this.getCards(player);
                if (availableCards.length === 0) {
                    // No more cards to discard
                    event.cards = cardsDiscarded;
                    if (cardsDiscarded.length > 0) {
                        context.game.addMessage(
                            '{0} randomly discards {1}',
                            player,
                            cardsDiscarded
                        );
                    }
                    return;
                }

                const randomCard = _.sample(availableCards);
                cardsDiscarded.push(randomCard);

                // Create a discard event for this specific card
                const discardEvent = context.game.actions
                    .discard({ chatMessage: false })
                    .getEvent(randomCard, context);

                // Queue the discard event and continue after it's resolved
                context.game.queueSimpleStep(() => {
                    context.game.openEventWindow([discardEvent]);
                });

                context.game.queueSimpleStep(() => {
                    remainingAmount--;
                    discardNextCard();
                });
            };

            // Start the recursive discarding
            discardNextCard();
        });
    }

    getEvent(player, context) {
        return this.getSinglePlayerEvent(player, context);
    }
}

module.exports = RandomDiscardAction;
