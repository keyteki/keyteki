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

        let type = this.type === 'power' ? 'power counter' : this.type;
        if (!this.all && this.amount > 1) {
            type += 's';
        }

        this.effectMsg = `remove ${this.all ? 'all' : this.amount} ${type} from {0}`;
    }

    getAmount(card) {
        return this.all ? card.tokens[this.type] || 0 : this.amount;
    }

    checkEventCondition(event) {
        return !!event.card.tokens[event.type] && super.checkEventCondition(event);
    }

    canAffect(card, context) {
        return (
            (this.all || this.amount > 0) &&
            card.location === 'play area' &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent(
            'onRemoveToken',
            { type: this.type, card: card, context: context, amount: this.getAmount(card) },
            (event) => {
                card.removeToken(event.type, event.amount);
            }
        );
    }
}

module.exports = RemoveTokenAction;
