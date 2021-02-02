const Card = require('../../Card.js');

class AmberspineMongrel extends Card {
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
