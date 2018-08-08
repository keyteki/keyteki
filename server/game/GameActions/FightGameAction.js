const CardGameAction = require('./CardGameAction');

class FightGameAction extends CardGameAction {
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
        } else if(this.attacker.exhausted || !this.attacker.checkRestrictions('fight', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    preEventHandler(context) {
        this.attacker.exhaust();
        super.preEventHandler(context);
    }

    getEvent(card, context) {
        let params = {
            card: card,
            context: context,
            attacker: this.attacker,
            destroyed: []
        };
        return super.createEvent('onFight', params, event => {
            if(!event.defender.getKeywordValue('elusive') || event.defender.elusiveUsed) {
                let damageEvents = [];
                if(!event.attacker.getKeywordValue('skirmish')) {
                    let defenderParams = {
                        amount: event.card.power,
                        fightEvent: event,
                        damageSource: event.card
                    };
                    damageEvents.push(context.game.actions.dealDamage(defenderParams).getEvent(event.attacker, context));
                }
                let attackerParams = {
                    amount: event.attacker.power,
                    fightEvent: event,
                    damageSource: event.attacker
                };
                damageEvents.push(context.game.actions.dealDamage(attackerParams).getEvent(event.card, context));
                context.game.openEventWindow(damageEvents);
            }
            event.defender.elusiveUsed = true;
        });
    }
}

module.exports = FightGameAction;
