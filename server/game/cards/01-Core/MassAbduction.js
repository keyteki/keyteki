const Card = require('../../Card.js');

class MassAbduction extends Card {
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
