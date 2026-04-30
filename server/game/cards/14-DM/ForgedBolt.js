const Card = require('../../Card.js');

class ForgedBolt extends Card {
    // Play: Deal 1 to each creature for each forged key.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                amount:
                    context.player.getForgedKeys() +
                    (context.player.opponent ? context.player.opponent.getForgedKeys() : 0),
                target: context.game.creaturesInPlay
            }))
        });
    }
}

ForgedBolt.id = 'forged-bolt';

module.exports = ForgedBolt;
