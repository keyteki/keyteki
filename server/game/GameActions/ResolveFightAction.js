const CardGameAction = require('./CardGameAction');

class ResolveFightAction extends CardGameAction {
    setDefaultProperties() {
        this.attacker = null;
        this.ignoreTaunt = false;
    }

    setup() {
        this.name = 'attack';
        this.targetType = ['creature'];
        this.effectMsg = 'make {1} fight {0}';
        this.effectArgs = this.attacker;
    }

    canAffect(card, context) {
        if (
            card.location !== 'play area' ||
            !this.attacker ||
            this.attacker.location !== 'play area'
        ) {
            return false;
        } else if (
            !this.attacker.checkRestrictions('fight') ||
            card.controller === this.attacker.controller
        ) {
            return false;
        } else if (
            !card.checkRestrictions('attackDueToTaunt') &&
            !this.ignoreTaunt &&
            !this.attacker.ignores('taunt') &&
            context.stage !== 'effect'
        ) {
            return false;
        }

        return card.checkRestrictions(this.name, context) && super.canAffect(card, context);
    }

    getEvent(card, context) {
        let params = {
            card: card,
            context: context,
            condition: (event) =>
                !event.cancelFight &&
                event.attacker.location === 'play area' &&
                event.card.location === 'play area',
            attacker: this.attacker,
            attackerClone: this.attacker.createSnapshot(),
            attackerTarget: card,
            defenderTarget: this.attacker,
            destroyed: [],
            cancelFight: false
        };
        let fightEvent = super.createEvent('onFight', params, (event) => {
            if (!this.canAffect(event.card, event.context)) {
                return;
            }

            let damageEvent;
            let defenderAmount = event.card.power;
            if (event.card.anyEffect('limitFightDamage')) {
                defenderAmount = Math.min(
                    defenderAmount,
                    ...event.card.getEffects('limitFightDamage')
                );
            }

            let defenderParams = {
                amount: defenderAmount,
                fightEvent: event,
                damageSource: event.card
            };
            let attackerAmount =
                event.attacker.power +
                event.attacker
                    .getEffects('bonusFightDamage')
                    .reduce((total, match) => total + match(event.attackerTarget), 0);
            if (event.attacker.anyEffect('limitFightDamage')) {
                attackerAmount = Math.min(
                    attackerAmount,
                    ...event.attacker.getEffects('limitFightDamage')
                );
            }

            let attackerParams = {
                amount: attackerAmount,
                fightEvent: event,
                damageSource: event.attacker
            };
            if (
                !event.card.getKeywordValue('elusive') ||
                event.card.elusiveUsed ||
                event.attacker.ignores('elusive')
            ) {
                if (
                    (!event.attacker.getKeywordValue('skirmish') ||
                        event.defenderTarget !== event.attacker) &&
                    event.card.checkRestrictions('dealFightDamage') &&
                    event.attackerTarget.checkRestrictions('dealFightDamageWhenDefending')
                ) {
                    damageEvent = context.game.actions
                        .dealDamage(defenderParams)
                        .getEvent(event.defenderTarget, context);
                }

                if (event.attacker.checkRestrictions('dealFightDamage')) {
                    let attackerDamageEvent = context.game.actions
                        .dealDamage(attackerParams)
                        .getEvent(event.attackerTarget, context);

                    if (damageEvent) {
                        damageEvent.addChildEvent(attackerDamageEvent);
                    } else {
                        damageEvent = attackerDamageEvent;
                    }

                    let splashAttackAmount = event.attacker.getKeywordValue('splash-attack');

                    if (splashAttackAmount > 0) {
                        let splashParams = Object.assign({}, attackerParams, {
                            amount: splashAttackAmount,
                            damageType: 'splash-attack'
                        });
                        event.attackerTarget.neighbors.forEach((neighbor) => {
                            damageEvent.addChildEvent(
                                context.game.actions
                                    .dealDamage(splashParams)
                                    .getEvent(neighbor, context)
                            );
                        });
                    }
                }
            } else if (
                event.attackerTarget !== event.card &&
                event.attacker.checkRestrictions('dealFightDamage')
            ) {
                damageEvent = context.game.actions
                    .dealDamage(attackerParams)
                    .getEvent(event.attackerTarget, context);
            }

            if (damageEvent) {
                event.card.isFighting = true;
                event.attacker.isFighting = true;
                context.game.checkGameState(true);
                context.game.openEventWindow(damageEvent);
                context.game.queueSimpleStep(() => {
                    event.card.isFighting = false;
                    event.attacker.isFighting = false;
                });
            }
        });

        fightEvent.addChildEvent(
            context.game.getEvent(
                'onUseCard',
                {
                    card: params.attacker,
                    fightEvent: fightEvent,
                    context: context,
                    fight: true
                },
                (event) => {
                    event.fightEvent.card.elusiveUsed = true;
                    event.card.unenrage();
                }
            )
        );

        return fightEvent;
    }
}

module.exports = ResolveFightAction;
