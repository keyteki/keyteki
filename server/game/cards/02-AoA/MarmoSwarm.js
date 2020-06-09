const Card = require('../../Card.js');

class MarmoSwarm extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card, context) => context.player.amber)
        });
    }
}

MarmoSwarm.id = 'marmo-swarm';

module.exports = MarmoSwarm;
