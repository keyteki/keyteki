const PlayerAction = require('./PlayerAction');

class SearchAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = null;
        this.location = ['deck', 'discard'];
        this.reveal = true;
    }

    setup() {
        super.setup();
        this.name = 'search';
        this.effectMsg = 'search their deck and discard for ' + this.cardName;
    }

    canAffect(player, context) {
        return (this.amount || this.cardName) && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent('onSearch', { player: player, context: context, location: this.location }, () => {
            context.game.promptForSelect(player, {
                location: this.location,
                controller: 'self',
                context: context,
                numCards: this.amount,
                cardCondition: card => !this.cardName || card.name === this.cardName,
                mode: this.amount > 0 ? 'upTo' : 'unlimited',
                onSelect: (player, cards) => {
                    if(cards.length > 0) {
                        let cardMessageInfo = '{1}';
                        if(!this.reveal) {
                            cardMessageInfo = cards.length === 1 ? 'a card' : '{2} cards';
                        }

                        context.game.addMessage(`{0} takes ${cardMessageInfo} into their hand`, player, cards, cards.length);
                        for(let card of cards) {
                            player.moveCard(card, 'hand');
                        }
                    } else {
                        context.game.addMessage('{0} doesn\'t take anything', player);
                    }

                    return true;
                }
            });
        });
    }
}

module.exports = SearchAction;
