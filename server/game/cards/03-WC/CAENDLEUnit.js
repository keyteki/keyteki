const Card = require('../../Card.js');

class CandleUnit extends Card {
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
