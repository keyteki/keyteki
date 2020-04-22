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

        return super.createEvent('onDamageDealt', params, damageDealtEvent => {
            //  Use Ward to prevent damage
            //  Use Armor to prevent damage
            //  Deal damage, and mark creatures for destruction

            /*
                Event sequences (ABC, XYZ):
                Interrupts to ABC
                Resolve ABC
                Game state check
                Reactions ABC
                Interrupts to XYZ
                Resolve XYZ
                Game state check
                Reactions XYZ

                Events sharing interupts (ABC, XYZ):
                Interrupts to ABC
                Resolve ABC
                Game state check
                Interrupts to XYZ
                Resolve XYZ
                Game state check
                Reactions to ABCXYZ
            */

            /*
                onDamageDealt event - interrupts
                check for ward, remove it (raise event?)
                check for armor:
                    onDamagePreventedByArmor interrupts
                    reduce damage amount in original event?
                    onDamagePreventedByArmor reactions
                deal damage:
                    onDamageApplied interrupts
                    place tokens on creatures
                    check for lethal damage
                    queue Destroy events
                    onDamageApplied reactions?
                onDamageDealt reactions, onDamageApplied reactions, onCreatureDestroyed reactions,
            */

            if(card.warded) {
                for(let event in damageDealtEvent.getSimultaneousEvents().filter(event => event.name === 'onDamageDealt' && event.card === card)) {
                    event.cancel();
                }

                card.unward();
                return;
            }

            let damageAppliedParams = {
                amount: damageDealtEvent.amount,
                card: damageDealtEvent.card,
                context: damageDealtEvent.context
            };
            let damageAppliedEvent = super.createEvent('onDamageApplied', damageAppliedParams, event => {
                event.noGameStateCheck = true;
                event.card.addToken('damage', event.amount);
                if(!event.card.moribund && (event.card.tokens.damage >= event.card.power || damageDealtEvent.damageSource && damageDealtEvent.damageSource.getKeywordValue('poison'))) {
                    event.addNextEvent(context.game.actions.destroy({ damageEvent: damageDealtEvent, purge: this.purge }).getEvent(event.card, context.game.getFrameworkContext()));
                    if(damageDealtEvent.fightEvent) {
                        damageDealtEvent.fightEvent.destroyed.push(event.card);
                    }
                }
            });
            damageDealtEvent.sharesReactionWindowWith(damageAppliedEvent);

            if(damageDealtEvent.ignoreArmor) {
                damageDealtEvent.addNextEvent(damageAppliedEvent);
            } else {
                let armorPreventParams = {
                    card: damageDealtEvent.card,
                    context: damageDealtEvent.context,
                    amout: damageDealtEvent.amount
                };
                let armorPreventEvent = super.createEvent('onDamagePreventedByArmor', armorPreventParams, event => {
                    const currentArmor = event.card.armor - event.card.armorUsed;
                    if(amount <= currentArmor) {
                        card.armorUsed += event.amount;
                        event.damagePrevented = event.amount;
                    } else {
                        card.armorUsed += currentArmor;
                        event.damagePrevented = currentArmor;
                    }

                    damageAppliedEvent.amount -= event.damagePrevented;
                    damageDealtEvent.amount -= event.damagePrevented;
                });
                damageDealtEvent.addNextEvent(armorPreventEvent);
                armorPreventEvent.addNextEvent(damageAppliedEvent);
            }
        });
    }
}

module.exports = DealDamageAction;
