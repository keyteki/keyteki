const PlayerAction = require('./PlayerAction');

class SearchAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = null;
        this.discardToDeck = false;
    }

    setup() {
        super.setup();
        this.name = 'search';
        this.effectMsg = 'search their deck and discard for ' + this.cardName;
    }

    canAffect(player, context) {
        return this.cardName && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent('onSearch', { player, context }, () => {
            context.game.promptForSelect(player, {
                location: ['deck', 'discard'],
                controller: 'self',
                context: context,
                numCards: this.amount,
                cardCondition: card => card.name === this.cardName,
                mode: this.amount ? 'upTo' : 'unlimited',
                onSelect: (player, cards) => {
                    if(cards.length > 0) {
                        context.game.addMessage('{0} takes {1} into their hand', player, cards);
                        for(let card of cards) {
                            player.moveCard(card, 'hand');
                        }
                    } else {
                        context.game.addMessage('{0} doesn\'t take anything', player);
                    }

                    return true;
                }
            });
            if(this.discardToDeck) {
                context.game.addMessage('{0} shuffles their discard into their deck', player);
                for(let card of player.discard) {
                    player.moveCard(card, 'deck');
                }

                player.shuffleDeck();
            }
        });
    }
}

module.exports = SearchAction;
