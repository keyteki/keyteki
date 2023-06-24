const Card = require('../../Card.js');

class UnlockedGateway extends Card {
    // Omega. (After you play this card,
    // end this step.)
    // Play: Destroy each creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay
            }))
        });
    }
}

UnlockedGateway.id = 'unlocked-gateway';

module.exports = UnlockedGateway;
