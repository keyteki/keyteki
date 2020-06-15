const PlayerAction = require('./PlayerAction');

class RearrangeCardsAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 3;
    }

    setup() {
        super.setup();
        this.name = 'rearrangeDeck';
        this.effectMsg = `look at the top ${this.amount} cards of their deck and rearrange them in any order`;
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return this.amount && player.deck.length > 0 && super.canAffect(player, context);
    }

    promptForRemainingCards(context) {
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select first card to return (last one is top)',
            context: context,
            cards: this.remainingCards,
            cardHandler: (card) => {
                this.orderedCards.unshift(card);
                this.remainingCards = this.remainingCards.filter((c) => c !== card);

                if (this.remainingCards.length === 1) {
                    this.orderedCards.unshift(this.remainingCards[0]);
                } else {
                    this.promptForRemainingCards(context);
                }
            }
        });
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        let player = this.target[0];
        this.amount = Math.min(this.amount, player.deck.length);
        this.orderedCards = this.amount === 1 ? player.deck.slice(0, 1) : [];
        this.remainingCards = player.deck.slice(0, this.amount);

        if (this.amount > 1) {
            this.promptForRemainingCards(context);
        }
    }

    getEvent(player, context) {
        return super.createEvent(
            'unnamedEvent',
            { player: player, cards: this.orderedCards, context: context },
            () => {
                player.deck.splice(0, this.amount, ...this.orderedCards);
            }
        );
    }
}

module.exports = RearrangeCardsAction;
