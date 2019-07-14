const Card = require('../../Card.js');

class Angwish extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(() => this.tokens.damage || 0)
        });
    }
}

Angwish.id = 'angwish';

module.exports = Angwish;
