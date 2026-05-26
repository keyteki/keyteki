const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class MoveToBottomAction extends CardGameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
    }

    setDefaultProperties() {}

    setup() {
        super.setup();
        this.name = 'moveToBottom';
        this.effectMsg = 'put a card at the bottom of the deck';
    }

    getEvent(card, context) {
        return super.createEvent(EVENTS.unnamedEvent, { card: card, context: context }, () => {
            let oldTopOfDeck = card.owner.deck[0];
            card.owner.deck = card.owner.deck.filter((c) => c !== card);
            card.owner.deck.push(card);
            card.owner.checkDeckAfterCardMove(oldTopOfDeck);
        });
    }
}

module.exports = MoveToBottomAction;
