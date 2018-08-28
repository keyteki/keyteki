const CardGameAction = require('./CardGameAction');

class HealAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.fully = false;
    }

    setup() {
        this.name = 'heal';
        this.targetType = ['creature'];
        this.effectMsg = 'heal {0} ' + (this.fully ? 'fully' : ('for ' + this.amount + ' damage'));
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || !card.hasToken('damage') || this.amount === 0) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let amount = Math.min(card.tokens.damage, this.amount);
        return super.createEvent('onHeal', { amount, card, context }, event => {
            if(this.fully) {
                card.removeToken('damage');
            } else {
                card.removeToken('damage', event.amount);
            }
        });
    }
}

module.exports = HealAction;
