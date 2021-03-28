const Card = require('../../Card.js');

class Spyyyder extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: (event, context) =>
                    event.attacker === context.source && event.attackerTarget.isOnFlank()
            },
            gameAction: ability.actions.cardLastingEffect({
                effect: ability.effects.addKeyword({ poison: 1 })
            }),
            effect: 'add poison when attacking a flank creature'
        });
    }
}

Spyyyder.id = 'spyyyder';

module.exports = Spyyyder;
