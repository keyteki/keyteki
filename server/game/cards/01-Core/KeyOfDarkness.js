const Card = require('../../Card.js');

class KeyOfDarkness extends Card {
    // Play: Forge a key at +6A current cost.
    // If your opponent has no A, forge a key at +2A current cost instead.
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
