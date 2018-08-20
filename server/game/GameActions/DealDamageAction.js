const CardGameAction = require('./CardGameAction');

class DealDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = null;
        this.amountForCard = (card, context) => 1; // eslint-disable-line no-unused-vars
        this.fightEvent = null;
        this.damageSource = null;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'damage';
        this.effectMsg = 'deal {1}damage to {0}';
        this.effectArgs = this.amount ? this.amount + ' ' : '';
    }

    canAffect(card, context) {
        if(this.amount === 0 || !this.amount && this.amountForCard(card, context) === 0) {
            return false;
        }
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        let params = {
            amount: this.amount || this.amountForCard(card, context),
            card: card,
            context: context,
            damageSource: this.damageSource,
            destroyed: false,
            fightEvent: this.fightEvent
        };
        return super.createEvent('onDamageDealt', params, event => {
            let target = event.card;
            if(target.anyEffect('transferDamage')) {
                target = target.mostRecentEffect('transferDamage');
            }
            let currentArmor = target.armor - target.armorUsed;
            if(event.amount <= currentArmor) {
                target.armorUsed += event.amount;
            } else {
                target.armorUsed += currentArmor;
                target.addToken('damage', event.amount - currentArmor);
                if(target.tokens.damage >= target.power || event.damageSource && event.damageSource.getKeywordValue('poison')) {
                    context.game.actions.destroy({ inFight: !!event.fightEvent }).resolve(target, context.game.getFrameworkContext());
                    if(event.fightEvent) {
                        event.fightEvent.destroyed.push(target);
                    }
                    event.destroyed = true;
                }
            }
        });
    }
}

module.exports = DealDamageAction;
