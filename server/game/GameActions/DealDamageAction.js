const CardGameAction = require('./CardGameAction');

class DealDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.fightEvent = null;
        this.damageSource = null;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'damage';
        this.effectMsg = 'deal {1} damage to {0}';
        this.effectArgs = this.amount;
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        let params = {
            amount: this.amount,
            card: card,
            context: context,
            damageSource: this.damageSource,
            fightEvent: this.fightEvent
        };
        return super.createEvent('onDamageDealt', params, event => {
            let currentArmor = event.card.armor - event.card.armorUsed;
            if(event.amount <= currentArmor) {
                event.card.armorUsed += event.amount;
            } else {
                event.card.armorUsed += currentArmor;
                event.card.damage += event.amount - currentArmor;
                if(event.card.damage > event.card.power || event.damageSource.getKeywordValue('poison')) {
                    context.game.actions.destroy().resolve(event.card, context.game.getFrameworkContext());
                    event.fightEvent.destroyed.push(event.card);
                }
            }
        });
    }
}

module.exports = DealDamageAction;
