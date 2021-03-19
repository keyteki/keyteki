const Card = require('../../Card.js');

class Mollymawk extends Card {
    //Play: Destroy an artifact.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Mollymawk.id = 'mollymawk';

module.exports = Mollymawk;
