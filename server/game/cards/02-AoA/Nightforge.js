const Card = require('../../Card.js');

class Nightforge extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.keysForgedThisRound.length === 0,
            gameAction: ability.actions.forgeKey({
                may: true,
                modifier: 4
            })
        });
    }
}

Nightforge.id = 'nightforge';

module.exports = Nightforge;
