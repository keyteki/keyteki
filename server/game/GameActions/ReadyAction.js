const CardGameAction = require('./CardGameAction');

class ReadyAction extends CardGameAction {
    setup() {
        this.name = 'ready';
        this.targetType = ['creature', 'artifact'];
        this.effectMsg = 'ready {0}';
    }

    canAffect(card, context) {
        if (card.game.currentPhase === 'ready' && !card.readiesDuringReadyPhase()) {
            return false;
        }
        return (
            card.location === 'play area' &&
            card.checkRestrictions('ready', context) &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent(
            'onCardReadied',
            { card: card, context: context, exhausted: card.exhausted },
            () => card.ready()
        );
    }
}

module.exports = ReadyAction;
