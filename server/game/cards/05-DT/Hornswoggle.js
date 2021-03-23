const Card = require('../../Card.js');

class Hornswoggle extends Card {
    setupCardAbilities(ability) {
        // Play: Use an opponent's artifact as if it were yours.
        this.play({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.use()
            }
        });
    }
}

Hornswoggle.id = 'hornswoggle';

module.exports = Hornswoggle;
