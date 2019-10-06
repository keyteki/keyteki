const Card = require('../../Card.js');

class CAENDLEUnit extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) => event.card.type === 'creature' && event.card.controller !== context.source.controller
            },
            gameAction: ability.actions.draw()
        });
        this.action({
            gameAction: ability.actions.capture()
        });
    }
}

CAENDLEUnit.id = 'caendle-unit';

module.exports = CAENDLEUnit;
