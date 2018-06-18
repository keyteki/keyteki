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
        return this.amount !== 0 && player.conflictDeck.size() > 0 && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent('onDeckSearch', { player: player, amount: this.amount, context: context }, () => {
            let amount = this.amount > -1 ? this.amount : player.conflictDeck.size();
            context.game.promptWithHandlerMenu(player, {
                activePromptTitle: 'Select a card to ' + (this.reveal ? 'reveal and ' : '') + 'put in your hand',
                cards: player.conflictDeck.first(amount).filter(card => this.cardCondition(card, context)),
                choices: ['Take nothing'],
                handlers: [() => {
                    context.game.addMessage('{0} takes nothing', player);
                    player.shuffleConflictDeck();
                }],
                cardHandler: card => {
                    if(this.reveal) {
                        context.game.addMessage('{0} takes {1} and adds it to their hand', player, card);
                    } else {
                        context.game.addMessage('{0} takes a card into their hand', player);
                    }
                    player.moveCard(card, 'hand');
                    player.shuffleConflictDeck();
                }
            });
        });
    }
}

module.exports = DeckSearchAction;
