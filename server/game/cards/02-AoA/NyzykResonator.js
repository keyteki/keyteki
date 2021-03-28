const Card = require('../../Card.js');

class NyzykResonator extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(
                (player, context) => context.source.neighbors.length * 2
            )
        });
    }
}

NyzykResonator.id = 'nyzyk-resonator';

module.exports = NyzykResonator;
