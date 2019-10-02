const CardGameAction = require('./CardGameAction');

class DealDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = null;
        this.amountForCard = () => 1;
        this.reduceArmorBy = null;
        this.fightEvent = null;
        this.damageSource = null;
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
        let damagePrevented = 0;

        if(this.canAffect(card, context)) {
            if(this.reduceArmorBy) {
                card.armorUsed += this.reduceArmorBy(card, context);
            }

            let currentArmor = this.ignoreArmor ? 0 : (card.armor - card.armorUsed);

            if(amount <= currentArmor) {
                card.armorUsed += amount;
                damagePrevented = amount;
                amount = 0;
            } else {
                damagePrevented = currentArmor;
                card.armorUsed += currentArmor;
                amount -= currentArmor;
            }
        } else {
            amount = 0;
        }

        let params = {
            card: card,
            context: context,
            amount: amount,
            damageSource: this.damageSource,
            destroyed: false,
            fightEvent: this.fightEvent,
            damagePrevented: damagePrevented
        };

        // Update armor token
        if(this.noGameStateCheck) {
            card.removeToken('armor');
            if(card.armor - card.armorUsed > 0) {
                card.addToken('armor', card.armor - card.armorUsed);
            }
        }

        return super.createEvent('onDamageDealt', params, event => {
            if(event.amount === 0) {
                return;
            }

            let card = event.card;

            if(card.warded) {
                if(!this.noGameStateCheck) {
                    card.unward();
                } else {
                    card.addToken('wardHit', event.amount);
                }
            } else {
                card.addToken('damage', event.amount);
            }

            if(!card.moribund && !this.noGameStateCheck && (card.tokens.damage >= card.power || event.damageSource && event.damageSource.getKeywordValue('poison'))) {
                card.moribund = true;
                context.game.actions.destroy({ inFight: !!event.fightEvent, purge: this.purge }).resolve(card, context.game.getFrameworkContext());
                if(event.fightEvent) {
                    event.fightEvent.destroyed.push(card);
                }
                event.destroyed = true;
            }
        });
    }
}

module.exports = DealDamageAction;
