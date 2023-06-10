const Card = require('../../Card.js');

class Resurgence extends Card {
    // Enhance R. (These icons have already been added to cards in your deck.)
    // Play: Return a creature from your discard pile to your hand. If that creature is a Mutant, return another creature from your discard pile to your hand.
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
                },
                message: '{0} uses {1} to return {2} to their hand'
            })
        });
    }
}

Resurgence.id = 'resurgence';

module.exports = Resurgence;
