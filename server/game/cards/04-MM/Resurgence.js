const Card = require('../../Card.js');

class Resurgence extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'discard',
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            },
            then: (preContext) => ({
                condition: () => preContext.target.hasTrait('mutant'),
                target: {
                    location: 'discard',
                    controller: 'self',
                    cardType: 'creature',
                    gameAction: ability.actions.returnToHand({ location: 'discard' })
                }
            })
        });
    }
}

Resurgence.id = 'resurgence';

module.exports = Resurgence;
