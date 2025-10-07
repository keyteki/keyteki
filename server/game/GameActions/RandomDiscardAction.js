import PlayerAction from './PlayerAction.js';
import _ from 'underscore';

class RandomDiscardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        // hand, deck or archives
        this.location = 'hand';
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
        return (
            this.amount > 0 && this.getCards(player).length > 0 && super.canAffect(player, context)
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

    getEvent(player, context) {
        return super.createEvent(
            'unnamedEvent',
            { player, context, amount: this.amount },
            (event) => {
                const cardsToDiscard = [];
                let remainingAmount = event.amount;

                // Create a recursive function to discard cards one at a time
                const discardNextCard = () => {
                    if (remainingAmount <= 0) {
                        // All cards discarded, finish the event
                        event.cards = cardsToDiscard;
                        if (cardsToDiscard.length > 0) {
                            context.game.addMessage(
                                '{0} discards {1} at random',
                                player,
                                event.cards
                            );
                        }
                        return;
                    }

                    const availableCards = this.getCards(player);
                    if (availableCards.length === 0) {
                        // No more cards to discard, finish the event
                        event.cards = cardsToDiscard;
                        if (cardsToDiscard.length > 0) {
                            context.game.addMessage(
                                '{0} discards {1} at random',
                                player,
                                event.cards
                            );
                        }
                        return;
                    }

                    const randomCard = _.sample(availableCards);
                    cardsToDiscard.push(randomCard);

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
            }
        );
    }
}

export default RandomDiscardAction;
