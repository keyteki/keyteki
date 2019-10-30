const CardGameAction = require('./CardGameAction');

class RearrangeDeckAction extends CardGameAction {
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

                if(this.remainingCards.length > 1) {
                    this.promptForRemainingCards(context);
                    return;
                } else if(this.remainingCards.length === 1) {
                    this.orderedCards.unshift(this.remainingCards[0]);
                }
            }
        });
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        this.orderedCards = [];
        this.remainingCards = context.player.deck.slice(0, this.amount);

        this.promptForRemainingCards(context);
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { cards: this.orderedCards, context: context }, () => {
            context.player.deck.splice(0, 3, ...this.orderedCards);
        });
    }
}

module.exports = RearrangeDeckAction;
