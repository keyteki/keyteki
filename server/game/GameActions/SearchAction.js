const PlayerAction = require('./PlayerAction');

class SearchAction extends PlayerAction {
    setDefaultProperties() {
        this.name = '';
    }

    setup() {
        super.setup();
        this.name = 'search';
        this.effectMsg = 'search their deck and discard for ' + this.name;
    }

    canAffect(player, context) {
        return this.name && super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('onSearch', { player, context }, () => {
            context.game.promptForSelect(player, {
                location: ['deck', 'discard'],
                controller: 'self',
                cardCondition: card => card.name === this.name,
                mode: 'unlimited',
                onSelect: (player, cards) => {
                    context.game.addMessage('{0} takes {1} into their hand', player, cards);
                    for(let card of cards) {
                        player.moveCard(card, 'hand');
                    }
                }
            });
            context.game.queueSimpleStep(() => {
                context.game.addMessage('{0} shuffles their discard into their deck', player);
                for(let card of player.discard) {
                    player.moveCard(card, 'deck');
                }
                player.shuffleDeck();
            });
        });
    }
}

module.exports = SearchAction;
