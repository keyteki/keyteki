const Card = require('../../Card.js');

class CandleUnit extends Card {
    // After an enemy creature reaps, draw a card.
    // Action: Capture 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.controller !== context.source.controller
            },
            gameAction: ability.actions.draw()
        });
        this.action({
            gameAction: ability.actions.capture()
        });
    }
}

CandleUnit.id = 'cændle-unit';

module.exports = CandleUnit;
