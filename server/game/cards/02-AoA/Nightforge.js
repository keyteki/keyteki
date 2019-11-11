const Card = require('../../Card.js');

class Nightforge extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.keyForged.length === 0,
            may: 'forge a key',
            gameAction: ability.actions.forgeKey({
                modifier: 4
            })
        });
    }
}

Nightforge.id = 'nightforge';

module.exports = Nightforge;
