const CardGameAction = require('./CardGameAction');

class AddTokenAction extends CardGameAction {
    constructor(propertyFactory, type = 'power') {
        super(propertyFactory);
        this.type = type;
    }

    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        this.name = 'addToken';
        this.targetType = ['creature', 'artifact', 'upgrade'];
        let token = '+1 power counters';
        if (this.amount === 1) {
            token = '+1 power counter';
        }

        this.effectMsg =
            'place ' + this.amount + ' ' + (this.type === 'power' ? token : this.type) + ' on {0}';
    }

    canAffect(card, context) {
        return this.amount > 0 && card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(
            'onAddToken',
            { card: card, context: context, amount: this.amount },
            () => card.addToken(this.type, this.amount)
        );
    }
}

module.exports = AddTokenAction;
