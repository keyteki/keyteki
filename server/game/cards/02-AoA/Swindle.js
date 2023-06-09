const Card = require('../../Card.js');

class Swindle extends Card {
    // Alpha. (You can only play this card before doing anything else this step.)
    // Omega. (After you play this card,
    // end this step.)
    // Play: Steal 3A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal({ amount: 3 })
        });
    }
}

Swindle.id = 'swindle';

module.exports = Swindle;
