const CardGameAction = require('./CardGameAction');

class FightGameAction extends CardGameAction {
    setDefaultProperties () {
        this.attacker = null;
        this.attackerExhausted = false;
    }

    setup() {
        this.name = 'attack';
        this.targetType = ['creature'];
        this.effectMsg = 'make {1} fight {0}';
        this.effectArgs = this.attacker;
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || !this.attacker || card.controller === this.attacker.controller) {
            return false;
        } else if(this.attacker.exhausted && !this.attackerExhausted || !this.attacker.checkRestrictions('fight', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    preEventHandler(context) {
        context.game.cardsUsed.push(context.source);
        this.attacker.exhaust();
        this.attackerExhausted = true;
        super.preEventHandler(context);
    }

    getEvent(card, context) {
        if(card.stunned) {
            return super.createEvent('onRemoveStun', {card: card, context: context}, () => card.unstun());
        }
        let params = {
            card: card,
            context: context,
            attacker: this.attacker,
            destroyed: []
        };
        return super.createEvent('onFight', params, event => {
            if(!event.card.getKeywordValue('elusive') || event.card.elusiveUsed) {
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
            event.card.elusiveUsed = true;
        });
    }
}

module.exports = FightGameAction;
