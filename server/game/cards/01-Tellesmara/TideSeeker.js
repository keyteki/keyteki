const Card = require('../../Card.js');

class TideSeeker extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'exhaust a unit you control, draw 1 card',
            target: {
                cardType: 'unit',
                controller: 'self',
                gameAction: ability.actions.exhaust()
            },
            then: {
                gameAction: ability.actions.draw()
            }
        });
    }
}

TideSeeker.id = 'tide-seeker';

module.exports = TideSeeker;
