const Card = require('../../Card.js');

class Francus extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterFight: (event, context) => event.attacker === context.source && event.defenderDestroyed ||
                                                event.defender === context.source && event.attackerDestroyed
            },
            gameAction: ability.actions.capture()
        });
    }
}

Francus.id = 'francus'; // This is a guess at what the id might be - please check it!!!

module.exports = Francus;
