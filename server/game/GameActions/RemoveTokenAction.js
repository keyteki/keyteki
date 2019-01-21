const CardGameAction = require('./CardGameAction');

class RemoveTokenAction extends CardGameAction {
    constructor(propertyFactory, type = 'power') {
        super(propertyFactory);
        this.type = type;
    }

    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        this.name = 'removeToken';
        this.targetType = ['artifact', 'creature'];
        let token = '+1 power counters';
        if(this.amount === 1) {
            token = '+1 power counter';
        }
        this.effectMsg = 'remove ' + this.amount + ' ' + (this.type === 'power' ? token : this.type) + ' on {0}';
    }

    canAffect(card, context) {
        return this.amount > 0 && card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onRemoveToken', { card: card, context: context, amount: this.amount }, () => card.removeToken(this.type, this.amount));
    }
}

module.exports = RemoveTokenAction;
