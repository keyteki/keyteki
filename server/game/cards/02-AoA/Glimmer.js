const Card = require('../../Card.js');

class Glimmer extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

Glimmer.id = 'glimmer';

module.exports = Glimmer;
