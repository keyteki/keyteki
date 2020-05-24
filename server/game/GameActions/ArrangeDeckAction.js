const CardGameAction = require('./CardGameAction');

class ArrangeDeckAction extends CardGameAction {
    setDefaultProperties() {
        this.index = -1;
        this.bottom = true;
        this.top = false;
    }

    setup() {
        super.setup();
        this.name = 'arrangeDeck';
        if (this.index > -1) {
            this.effectMsg = 'put a card in a different deck position';
        } else {
            this.effectMsg =
                'put a card in the ' + (this.bottom ? 'bottom' : 'top') + ' of the deck';
        }
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            context.player.deck = context.player.deck.filter((c) => c !== card);

            if (this.bottom) {
                context.player.deck.push(card);
            } else if (this.top) {
                context.player.deck.unshift(card);
            } else {
                context.player.deck.splice(this.index, 0, card);
            }
        });
    }
}

module.exports = ArrangeDeckAction;
