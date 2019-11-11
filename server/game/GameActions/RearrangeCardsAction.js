const CardGameAction = require('./CardGameAction');

class RearrangeCardsAction extends CardGameAction {
    setDefaultProperties() {
    }

    setup() {
        super.setup();
        this.name = 'rearrangeDeck';
        this.amount = 3;
        this.effectMsg = `look at the top ${this.amount} cards of their deck and rearrange them in any order`;
    }

    promptForRemainingCards(context) {
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select first card to return (last one is top)',
            context: context,
            cards: this.remainingCards,
            cardHandler: card => {
                this.orderedCards.unshift(card);
                this.remainingCards = this.remainingCards.filter(c => c !== card);

                if(this.remainingCards.length === 1) {
                    this.orderedCards.unshift(this.remainingCards[0]);
                } else {
                    this.promptForRemainingCards(context);
                }
            }
        });
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        this.amount = Math.min(this.amount, context.player.deck.length);
        this.orderedCards = this.amount === 1 ? context.player.deck : [];
        this.remainingCards = context.player.deck.slice(0, this.amount);

        if(this.amount > 1) {
            this.promptForRemainingCards(context);
        }
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { cards: this.orderedCards, context: context }, () => {
            context.player.deck.splice(0, this.amount, ...this.orderedCards);
        });
    }
}

module.exports = RearrangeCardsAction;
