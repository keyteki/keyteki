const CardGameAction = require('./CardGameAction');

class MoveToBottomAction extends CardGameAction {
    setDefaultProperties() {}

    setup() {
        super.setup();
        this.name = 'moveToBottom';
        this.effectMsg = 'put a card at the bottom of the deck';
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            context.player.deck = context.player.deck.filter((c) => c !== card);
            context.player.deck.push(card);
        });
    }
}

module.exports = MoveToBottomAction;
