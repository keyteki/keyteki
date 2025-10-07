import CardGameAction from './CardGameAction.js';

class RemoveWardAction extends CardGameAction {
    setup() {
        this.name = 'removeWard';
        this.targetType = ['creature'];
        this.effectMsg = 'remove the ward from {0}';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onRemoveWard', { card: card, context: context }, (event) =>
            event.card.unward()
        );
    }
}

export default RemoveWardAction;
