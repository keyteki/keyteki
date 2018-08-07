const CardGameAction = require('./CardGameAction');

class FightGameAction extends CardGameAction {
    setDefaultProperties () {
        this.attacker = null;
    }

    setup() {
        this.name = 'beAttacked';
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
            attackerDestroyed: false,
            defenderDestroyed: false
        };
        return super.createEvent('onFight', params, event => {
            event.attackerDestroyed = event.attacker.takeDamage(event.card.power);
            event.defenderDestroyed = event.card.takeDamage(event.attacker.power);
        });
    }
}

module.exports = FightGameAction;
