const PlayerAction = require('./PlayerAction');

class RandomDiscardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = 'discard ' + this.amount + ' cards at random';
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        let amount = Math.min(this.amount, player.hand.size());
        let cards = player.hand.shuffle().slice(0, amount);
        return super.createEvent('onCardsDiscardedFromHand', { player: player, cards: cards, context: context }, event => {
            if(event.cards.length === 0) {
                return;
            }
            player.game.addMessage('{0} discards {1} at random', player, cards);
            if(event.cards.length > 1) {
                player.game.promptForSelect(player, {
                    activePromptTitle: 'Choose order for random discard',
                    mode: 'exactly',
                    numCards: event.cards.length,
                    ordered: true,
                    location: 'hand',
                    controller: 'self',
                    source: context.source,
                    buttons: [{ test: 'Done', arg: 'done' }],
                    cardCondition: card => event.cards.includes(card),
                    onSelect: (player, cards) => {
                        cards = cards.concat(event.cards.filter(card => !cards.includes(card)));
                        for(const card of cards) {
                            player.moveCard(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
                        }
                        return true;
                    }
                });
            } else if(event.cards.length === 1) {
                let card = event.cards[0];
                player.moveCard(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
            }            
        });
    }
}

module.exports = RandomDiscardAction;
