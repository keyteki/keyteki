const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class ApplyDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = null;
        this.damageDealtEvent = null;
        this.damageSource = null;
        this.damageType = 'card effect';
        this.bonus = false;
        this.bypassWard = false;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'damage';
        this.effectMsg = `apply ${this.amount} damage to {0}`;
    }

    canAffect(card, context) {
        return this.amount > 0 && card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        const params = {
            card: card,
            context: context,
            amount: this.amount,
            damageType: this.damageType,
            bonus: this.bonus,
            damageSource: this.damageSource,
            damageDealtEvent: this.damageDealtEvent,
            fightEvent: this.damageDealtEvent ? this.damageDealtEvent.fightEvent : null,
            bypassWard: this.bypassWard,
            destroyEvent: null
        };

        return super.createEvent(EVENTS.onDamageApplied, params, (event) => {
            event.noGameStateCheck = true;

            event.card.addToken('damage', event.amount);
            if (
                !event.card.moribund &&
                (event.card.tokens.damage >= event.card.power ||
                    (event.amount > 0 &&
                        event.fightEvent &&
                        event.damageType === 'card effect' &&
                        event.damageSource &&
                        event.damageSource.getKeywordValue('poison')))
            ) {
                event.destroyEvent = context.game.actions
                    .destroy({ damageEvent: event, bypassWard: event.bypassWard })
                    .getEvent(event.card, context.game.getFrameworkContext());

                if (event.damageDealtEvent) {
                    event.damageDealtEvent.destroyEvent = event.destroyEvent;
                    event.destroyEvent.destroyedByDamageDealt =
                        event.damageDealtEvent.card === event.card;
                }

                if (event.fightEvent) {
                    event.destroyEvent.fightEvent = event.fightEvent;
                    event.destroyEvent.destroyedFighting =
                        event.fightEvent.card === event.card ||
                        event.fightEvent.attacker === event.card;
                    event.fightEvent.destroyed.push(event.card);
                }

                event.addSubEvent(event.destroyEvent);
            }
        });
    }
}

module.exports = ApplyDamageAction;
