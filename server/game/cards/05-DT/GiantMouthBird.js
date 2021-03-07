const Card = require('../../Card.js');

class GiantMouthBird extends Card {
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

GiantMouthBird.id = 'giant-mouth-bird';

module.exports = GiantMouthBird;
