const CardGameAction = require('./CardGameAction');

class HonorAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.fully = false;
    }

    setup() {
        this.name = 'heal';
        this.targetType = ['character'];
        this.effectMsg = 'heal {0} ' + (this.fully ? 'fully' : ('for ' + this.amount + ' damage'));
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || card.damage === 0 || this.amount === 0) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onHeal', { card: card, context: context }, () => {
            if(this.fully) {
                card.damage = 0;
            } else {
                card.damage = Math.max(0, card.damage - this.amount);
            }
        });
    }
}

module.exports = HonorAction;
