const Card = require('../../Card.js');

class MassAbduction extends Card {
    // Play: Put up to 3 damaged enemy creatures into your archives. If any of these creatures leave your archives, they are put into their owners hand instead.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.hasToken('damage'),
                gameAction: ability.actions.archive({ owner: false })
            }
        });
    }
}

MassAbduction.id = 'mass-abduction';

module.exports = MassAbduction;
