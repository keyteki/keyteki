const Card = require('../../Card.js');

class NyzykResonator extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(() => this.neighbors.length * 2)
        });
    }
}

NyzykResonator.id = 'nyzyk-resonator';

module.exports = NyzykResonator;
