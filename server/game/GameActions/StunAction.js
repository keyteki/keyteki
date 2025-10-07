import CardGameAction from './CardGameAction.js';

class StunAction extends CardGameAction {
    setup() {
        this.name = 'stun';
        this.targetType = ['creature'];
        this.effectMsg = 'stun {0}';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onStun', { card: card, context: context }, () => card.stun());
    }
}

export default StunAction;
