const CardGameAction = require('./CardGameAction');

class ReduceArmorAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = null;
        this.amountForCard = () => 1;
    }

    setup() {
        this.name = 'reduceArmor';
        this.targetType = ['creature'];
        this.effectMsg = "reduce {0}'s armor";
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context, amount = this.amount || this.amountForCard(card, context)) {
        return super.createEvent(
            'onReduceArmor',
            { card: card, context: context, amount: amount },
            (event) => {
                let amount = event.amount;

                if (amount === 0) {
                    return;
                }

                const currentArmor = event.card.tokens.armor || 0;
                if (currentArmor > 0) {
                    if (amount > currentArmor) {
                        amount = currentArmor;
                    }

                    event.card.armorUsed += amount;
                }
            }
        );
    }
}

module.exports = ReduceArmorAction;
