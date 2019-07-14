const Card = require('../../Card.js');

class BronzeKeyImp extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.playerCannot('forge', context => context.player.keys === 0)
        });
    }
}

BronzeKeyImp.id = 'bronze-key-imp';

module.exports = BronzeKeyImp;
