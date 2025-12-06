const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class DealDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = null;
        this.amountForCard = (card, context) => 1; // eslint-disable-line no-unused-vars
        this.fightEvent = null;
        this.damageSource = null;
        this.damageType = 'card effect';
        this.splash = 0;
        this.ignoreArmor = false;
        this.bonus = false;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'damage';
        this.effectMsg =
            'deal ' +
            (this.amount ? this.amount + ' ' : '') +
            'damage to {0}' +
            (this.splash ? ' and ' + this.splash + ' to their neighbors' : '');
    }

    canAffect(card, context) {
        if (this.amount === 0 || (!this.amount && this.amountForCard(card, context) === 0)) {
            return false;
        }

        return card.location === 'play area' && super.canAffect(card, context);
    }

    checkEventCondition(event) {
        if (!event.amount && !event.armorUsed) {
            return false;
        }

        return (
            event.card.location === 'play area' &&
            super.canAffect(event.card, event.context) &&
            event.card.checkRestrictions(this.name, event.context, event)
        );
    }

    computeAmount(card, context) {
        return this.amount === null ? this.amountForCard(card, context) : this.amount;
    }

    getReplacementEvent(card, context, amount = this.computeAmount(card, context)) {
        return super.createEvent(
            EVENTS.unnamedEvent,
            {
                card: card,
                context: context,
                amount: amount,
                armorUsed: 0
            },
            () => {
                let replaceDamage = card.mostRecentEffect('replaceDamage');
                replaceDamage.action.resolve(replaceDamage.targetFunc(card), context);
            }
        );
    }

    getEventArray(context) {
        const damageSource = this.damageSource || context.source;

        if (damageSource.anyEffect('replaceDamage')) {
            return [this.getReplacementEvent(damageSource, context)];
        }

        if (this.splash) {
            return this.target
                .filter((card) => this.canAffect(card, context))
                .reduce(
                    (array, card) =>
                        array.concat(
                            this.getEvent(card, context),
                            card.neighbors.map((neighbor) =>
                                this.getEvent(neighbor, context, this.splash)
                            )
                        ),
                    []
                );
        }

        return super.getEventArray(context);
    }

    unwardAndCancel(context, damageDealtEvent) {
        for (let event of damageDealtEvent
            .getSimultaneousEvents()
            .filter(
                (event) =>
                    event.name === EVENTS.onDamageDealt && event.card === damageDealtEvent.card
            )) {
            event.cancel();
        }

        let sourceArg;

        if (
            damageDealtEvent.damageSource &&
            damageDealtEvent.damageSource.name === 'Framework effect'
        ) {
            sourceArg = 'a bonus icon';
        } else {
            sourceArg = damageDealtEvent.damageSource;
        }

        context.game.addMessage(
            "{0}'s ward token prevents the damage dealt by {1} and is discarded",
            damageDealtEvent.card,
            sourceArg
        );

        damageDealtEvent.card.unward();
    }

    getEvent(card, context, amount = this.computeAmount(card, context)) {
        const damageSource = this.damageSource || context.source;

        if (damageSource.anyEffect('replaceDamage')) {
            return this.getReplacementEvent(damageSource, context, amount);
        }

        const params = {
            card: card,
            context: context,
            amount: amount + card.getEffects('bonusDamage').reduce((acc, b) => acc + b, 0),
            damageSource: damageSource,
            fightEvent: this.fightEvent,
            bonus: this.bonus,
            damageType: this.damageType,
            ignoreArmor: this.ignoreArmor
        };

        return super.createEvent(EVENTS.onDamageDealt, params, (damageDealtEvent) => {
            if (damageDealtEvent.card.warded) {
                this.unwardAndCancel(context, damageDealtEvent);
                return;
            }

            let armorUsed = 0;

            if (
                !damageDealtEvent.ignoreArmor &&
                damageDealtEvent.card.armor > damageDealtEvent.card.armorUsed
            ) {
                let currentArmor = damageDealtEvent.card.armor - damageDealtEvent.card.armorUsed;

                if (damageDealtEvent.amount <= currentArmor) {
                    armorUsed = damageDealtEvent.amount;
                } else {
                    armorUsed = currentArmor;
                }
            }

            let amountApplied = damageDealtEvent.amount - armorUsed;
            damageDealtEvent.amountApplied = amountApplied;

            let damageAppliedParams = {
                card: damageDealtEvent.card,
                context: damageDealtEvent.context,
                amount: amountApplied,
                damageSource: damageDealtEvent.damageSource,
                damageType: damageDealtEvent.damageType,
                damageDealtEvent: damageDealtEvent,
                bonus: damageDealtEvent.bonus
            };

            let damageAppliedEvent = context.game.actions
                .applyDamage(damageAppliedParams)
                .getEvent(damageDealtEvent.card, context.game.getFrameworkContext());

            let armorEvent;
            let armorParams = {
                card: damageDealtEvent.card,
                context: damageDealtEvent.context,
                amount: amountApplied,
                armorUsed: armorUsed,
                noGameStateCheck: true
            };

            if (!armorUsed) {
                armorEvent = super.createEvent(EVENTS.unnamedEvent, armorParams, (event) => {
                    event.addSubEvent(damageAppliedEvent);
                });
            } else {
                armorEvent = super.createEvent(
                    EVENTS.onDamagePreventedByArmor,
                    armorParams,
                    (event) => {
                        event.card.armorUsed += event.armorUsed;
                        event.addSubEvent(damageAppliedEvent);
                    }
                );
            }

            damageDealtEvent.addSubEvent(armorEvent);
            armorEvent.openReactionWindow = true;
        });
    }
}

module.exports = DealDamageAction;
