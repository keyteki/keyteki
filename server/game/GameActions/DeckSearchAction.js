const PlayerAction = require('./PlayerAction');

class DeckSearchAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = -1;
        this.reveal = true;
        this.cardCondition = (card, context) => true; // eslint-disable-line no-unused-vars
    }

    setup() {
        super.setup();
        this.name = 'deckSearch';
        if(this.amount > 0) {
            this.effectMsg = 'look at the top ' + (this.amount > 1 ? this.amount + ' cards' : 'card') + ' of their deck';
        } else {
            this.effectMsg = 'search their deck';
        }
    }

    canAffect(player, context) {
        return this.amount !== 0 && player.deck.length > 0 && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent('onDeckSearch', { player: player, amount: this.amount, context: context }, () => {
            let amount = this.amount > -1 ? this.amount : player.deck.length;
            context.game.promptWithHandlerMenu(player, {
                activePromptTitle: 'Select a card to ' + (this.reveal ? 'reveal and ' : '') + 'put in your hand',
                context: context,
                cards: player.deck.slice(0, amount).filter(card => this.cardCondition(card, context)),
                choices: [],
                handlers: [],
                cardHandler: card => {
                    if(this.reveal) {
                        context.game.addMessage('{0} takes {1} and adds it to their hand', player, card);
                    } else {
                        context.game.addMessage('{0} takes a card into their hand', player);
                    }

                    player.moveCard(card, 'hand');
                }
            });
        });
    }
}

module.exports = DeckSearchAction;
