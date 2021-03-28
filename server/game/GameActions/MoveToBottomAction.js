const CardGameAction = require('./CardGameAction');

class MoveToBottomAction extends CardGameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.targetPlayer = 'current';
    }

    setDefaultProperties() {}

    setup() {
        super.setup();
        this.name = 'moveToBottom';
        this.effectMsg = 'put a card at the bottom of the deck';
    }

    getEvent(card, context) {
        const targetPlayerForEffect = this.targetPlayer;

        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            let targetPlayer =
                targetPlayerForEffect === 'current' ? context.player : context.player.opponent;
            targetPlayer.deck = targetPlayer.deck.filter((c) => c !== card);
            targetPlayer.deck.push(card);
        });
    }
}

module.exports = MoveToBottomAction;
