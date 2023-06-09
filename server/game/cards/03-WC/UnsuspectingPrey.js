const Card = require('../../Card.js');

class UnsuspectingPrey extends Card {
    // Play: Deal 2D to up to 3undamaged creatures.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                cardCondition: (card) => !card.hasToken('damage'),
                numCards: 3,
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 2
                })
            }
        });
    }
}

UnsuspectingPrey.id = 'unsuspecting-prey';

module.exports = UnsuspectingPrey;
