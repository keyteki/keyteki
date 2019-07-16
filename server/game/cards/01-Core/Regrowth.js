const Card = require('../../Card.js');

class Regrowth extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

Regrowth.id = 'regrowth';

module.exports = Regrowth;
