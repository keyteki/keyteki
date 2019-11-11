const CardGameAction = require('./CardGameAction');

class DealDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = null;
        this.amountForCard = () => 1;
        this.fightEvent = null;
        this.damageSource = null;
        this.damageType = 'card effect';
        this.splash = 0;
        this.purge = false;
        this.ignoreArmor = false;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'damage';
        this.effectMsg = 'deal ' + (this.amount ? this.amount + ' ' : '') + 'damage to {0}' + (this.splash ? ' and ' + this.splash + ' to their neighbors' : '');
    }

    canAffect(card, context) {
        if(this.amount === 0 || !this.amount && this.amountForCard(card, context) === 0) {
            return false;
        }

        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEventArray(context) {
        if(this.splash) {
            return this.target.filter(card => this.canAffect(card, context)).reduce((array, card) => (
                array.concat(this.getEvent(card, context), card.neighbors.map(neighbor => this.getEvent(neighbor, context, this.splash)))
            ), []);
        }

        return super.getEventArray(context);
    }

    getEvent(card, context, amount = this.amount || this.amountForCard(card, context)) {
        const params = {
            card: card,
            context: context,
            amount: amount,
            damageSource: this.damageSource,
            damageType: this.damageType,
            destroyed: false,
            fightEvent: this.fightEvent,
            ignoreArmor: this.ignoreArmor
        };

        // Update armor token
        if(this.noGameStateCheck) {
            card.removeToken('armor');
            if(card.armor - card.armorUsed > 0) {
                card.addToken('armor', card.armor - card.armorUsed);
            }
        }

        return super.createEvent('onDamageDealt', params, event => {
            let amount = event.amount;

            if(amount === 0) {
                return;
            }

            if(!event.ignoreArmor) {
                const currentArmor = event.card.armor - event.card.armorUsed;
                if(amount <= currentArmor) {
                    card.armorUsed += event.amount;
                    event.damagePrevented = amount;
                    return;
                }

                event.damagePrevented = currentArmor;
                card.armorUsed += currentArmor;
                amount -= currentArmor;
            }

            event.card.addToken('damage', amount);
            if(!event.card.moribund && !this.noGameStateCheck && (event.card.tokens.damage >= event.card.power || event.damageSource && event.damageSource.getKeywordValue('poison'))) {
                event.addSubEvent(context.game.actions.destroy({ inFight: !!event.fightEvent, purge: this.purge }).getEvent(event.card, context.game.getFrameworkContext()));
                if(event.fightEvent) {
                    event.fightEvent.destroyed.push(event.card);
                }

                event.destroyed = true;
            }
        });
    }
}

module.exports = DealDamageAction;
