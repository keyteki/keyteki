const Card = require('../../Card.js');

class KeyOfDarkness extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forgeKey((context) => ({
                modifier: context.player.opponent && !context.player.opponent.amber ? 2 : 6
            }))
        });
    }
}

KeyOfDarkness.id = 'key-of-darkness';

module.exports = KeyOfDarkness;
