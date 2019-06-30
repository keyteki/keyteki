const CardGameAction = require('./CardGameAction');

class ResolveFightAction extends CardGameAction {
    setDefaultProperties () {
        this.attacker = null;
    }

    setup() {
        this.name = 'attack';
        this.targetType = ['creature'];
        this.effectMsg = 'make {1} fight {0}';
        this.effectArgs = this.attacker;
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || !this.attacker) {
            return false;
        } else if(!this.attacker.checkRestrictions('fight') || card.controller === this.attacker.controller) {
            return false;
        } else if(!card.checkRestrictions('attackDueToTaunt') && !this.attacker.ignores('taunt')) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let params = {
            card: card,
            context: context,
            condition: event => event.attacker.location === 'play area' && event.card.location === 'play area',
            attacker: this.attacker,
            attackerTarget: card,
            defenderTarget: this.attacker,
            destroyed: []
        };
        return super.createEvent('onFight', params, event => {
            let damageEvents = [];
            let defenderParams = {
                amount: event.card.power,
                fightEvent: event,
                damageSource: event.card
            };
            let attackerParams = {
                amount: event.attacker.power + event.attacker.getBonusDamage(event.attackerTarget),
                fightEvent: event,
                damageSource: event.attacker
            };
            if(!event.card.getKeywordValue('elusive') || event.card.elusiveUsed || event.attacker.ignores('elusive')) {
                if((!event.attacker.getKeywordValue('skirmish') || event.defenderTarget !== event.attacker) && event.card.checkRestrictions('dealFightDamage') && event.attackerTarget.checkRestrictions('dealFightDamageWhenDefending')) {
                    damageEvents.push(context.game.actions.dealDamage(defenderParams).getEvent(event.defenderTarget, context));
                }
                if(event.attacker.checkRestrictions('dealFightDamage')) {
                    damageEvents.push(context.game.actions.dealDamage(attackerParams).getEvent(event.attackerTarget, context));
                }
            } else if(event.attackerTarget !== event.card && event.attacker.checkRestrictions('dealFightDamage')) {
                damageEvents.push(context.game.actions.dealDamage(attackerParams).getEvent(event.attackerTarget, context));
            }
            context.game.openEventWindow(damageEvents);
            event.card.elusiveUsed = true;
        });
    }
}

module.exports = ResolveFightAction;
