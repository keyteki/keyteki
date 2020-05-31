const Card = require('../../Card.js');

class TheShadowsmith extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('mutant'),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

TheShadowsmith.id = 'the-shadowsmith';

module.exports = TheShadowsmith;
