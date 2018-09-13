const CardGameAction = require('./CardGameAction');

class DealDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = null;
        this.amountForCard = (card, context) => 1; // eslint-disable-line no-unused-vars
        this.fightEvent = null;
        this.damageSource = null;
        this.splash = 0;
        this.purge = false;
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

    getEvent(card, context, amount) {
        let params = {
            amount: amount || this.amount || this.amountForCard(card, context),
            card: card,
            context: context,
            damageSource: this.damageSource,
            destroyed: false,
            fightEvent: this.fightEvent
        };
        return super.createEvent('onDamageDealt', params, event => {
            let currentArmor = event.card.armor - event.card.armorUsed;
            if(event.amount <= currentArmor) {
                event.card.armorUsed += event.amount;
            } else {
                event.card.armorUsed += currentArmor;
                event.card.addToken('damage', event.amount - currentArmor);
                if(event.card.tokens.damage >= event.card.power || event.damageSource && event.damageSource.getKeywordValue('poison')) {
                    if(this.purge) {
                        context.game.actions.purge().resolve(event.card, context);
                    } else {
                        context.game.actions.destroy({ inFight: !!event.fightEvent }).resolve(event.card, context.game.getFrameworkContext());
                    }
                    if(event.fightEvent) {
                        event.fightEvent.destroyed.push(event.card);
                    }
                    event.destroyed = true;
                }
            }
        });
    }
}

module.exports = DealDamageAction;
