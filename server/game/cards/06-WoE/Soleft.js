const Card = require('../../Card.js');

class Soleft extends Card {
    // Destroyed: Destroy the creature on your opponent's left flank.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.destroy((context) => ({
                target: context.player.opponent ? context.player.opponent.creaturesInPlay[0] : []
            }))
        });
    }
}

Soleft.id = 'soleft';

module.exports = Soleft;
