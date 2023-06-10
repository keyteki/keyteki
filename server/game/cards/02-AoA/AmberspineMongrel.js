const Card = require('../../Card.js');

class AmberspineMongrel extends Card {
    // Hazardous 3.(Before this creature is attacked, deal 3D to the attacking enemy.)
    // After your opponent uses a creature to reap, gain 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.controller !== context.source.controller &&
                    event.card.type === 'creature'
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

AmberspineMongrel.id = 'æmberspine-mongrel';

module.exports = AmberspineMongrel;
