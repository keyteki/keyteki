const CardGameAction = require('./CardGameAction');

class RevealAction extends CardGameAction {
    setDefaultProperties() {
        this.chatMessage = false;
    }

    setup() {
        super.setup();
        this.name = 'reveal';
        this.effectMsg = 'reveal {0}';
    }

    canAffect(card, context) {
        return card.location === 'hand' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onRevealCards', { card, context }, () => {
            context.game.addMessage('{0} reveals {1}', context.source, card);
        });
    }
}

module.exports = RevealAction;
