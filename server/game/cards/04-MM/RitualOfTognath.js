const Card = require('../../Card.js');

class RitualOfTognath extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 2,
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

RitualOfTognath.id = 'ritual-of-tognath';

module.exports = RitualOfTognath;
