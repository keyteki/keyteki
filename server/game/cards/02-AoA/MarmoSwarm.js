const Card = require('../../Card.js');

class MarmoSwarm extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card) => card.controller.amber)
        });
    }
}

MarmoSwarm.id = 'marmo-swarm';

module.exports = MarmoSwarm;
