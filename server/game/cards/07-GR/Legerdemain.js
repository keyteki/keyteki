const Card = require('../../Card.js');

class Legerdemain extends Card {
    // Play: Return a damaged creature to its owner’s hand. If you do,
    // its controller gains 1.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasToken('damage'),
                gameAction: ability.actions.returnToHand()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.gainAmber({
                    amount: 1,
                    target: preThenContext.target ? preThenContext.target.controller : []
                })
            })
        });
    }
}

Legerdemain.id = 'legerdemain';

module.exports = Legerdemain;
