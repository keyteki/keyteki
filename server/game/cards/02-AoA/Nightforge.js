const Card = require('../../Card.js');

class Nightforge extends Card {
    // Play: If you have not forged a key
    // this turn, you may forge a key at
    // +4A current cost.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.keysForgedThisRound.length === 0,
            may: 'forge a key',
            gameAction: ability.actions.forgeKey({
                modifier: 4
            })
        });
    }
}

Nightforge.id = 'nightforge';

module.exports = Nightforge;
