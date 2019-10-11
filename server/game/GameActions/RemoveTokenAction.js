const CardGameAction = require('./CardGameAction');

class RemoveTokenAction extends CardGameAction {
    constructor(propertyFactory, type = 'power') {
        super(propertyFactory);
        this.type = type;
    }

    setDefaultProperties() {
        this.amount = 1;
        this.all = false;
    }

    setup() {
        this.name = 'removeToken';
        this.targetType = ['artifact', 'creature'];
        let token = '+1 power counters';
        if(this.amount === 1) {
            token = '+1 power counter';
        }
        this.effectMsg = 'remove ' + (this.all ? 'all' : this.amount) + ' ' + (this.type === 'power' ? token : this.type) + ' from {0}';
    }

    computeAmount(card) {
        return this.all ? card.tokens[this.type] || 0 : this.amount;
    }

    canAffect(card, context) {
        return this.computeAmount(card) > 0 && card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onRemoveToken', { type: this.type, card: card, context: context, amount: this.computeAmount(card) }, event => {
            card.removeToken(event.type, event.amount);
        });
    }
}

module.exports = RemoveTokenAction;
