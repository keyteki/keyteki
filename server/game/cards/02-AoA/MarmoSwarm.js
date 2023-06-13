const Card = require('../../Card.js');

class MarmoSwarm extends Card {
    // Marmo Swarm gets +1power for each A in your pool.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card) => card.controller.amber)
        });
    }
}

MarmoSwarm.id = 'marmo-swarm';

module.exports = MarmoSwarm;
