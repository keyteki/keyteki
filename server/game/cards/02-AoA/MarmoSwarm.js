const Card = require('../../Card.js');

class MarmoSwarm extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyPower(() => this.controller.amber)
        });
    }
}

MarmoSwarm.id = 'marmo-swarm';

module.exports = MarmoSwarm;
