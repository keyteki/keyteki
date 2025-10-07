import CardGameAction from './CardGameAction.js';

class WardAction extends CardGameAction {
    setup() {
        this.name = 'ward';
        this.targetType = ['creature'];
        this.effectMsg = 'ward {0}';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onWard', { card: card, context: context }, () => card.ward());
    }
}

export default WardAction;
