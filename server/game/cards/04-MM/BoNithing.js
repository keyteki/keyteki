const Card = require('../../Card.js');

class BoNithing extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.opponent ? context.player.opponent.getForgedKeys() : 0
            }))
        });
    }
}

BoNithing.id = 'bo-nithing';

module.exports = BoNithing;
