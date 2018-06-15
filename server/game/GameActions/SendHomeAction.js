const CardGameAction = require('./CardGameAction');

class SendHomeAction extends CardGameAction {
    setup() {
        this.name = 'sendHome';
        this.targetType = ['character'];
        this.effectMsg = 'send {0} home';
    }

    canAffect(card, context) {
        if(!super.canAffect(card, context)) {
            return false;
        }
        return card.isParticipating();
    }

    getEvent(card, context) {
        return super.createEvent('onSendHome', { card: card, context: context }, () => context.game.currentConflict.removeFromConflict(card));
    }
}

module.exports = SendHomeAction;
