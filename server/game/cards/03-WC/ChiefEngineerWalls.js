const Card = require('../../Card.js');

class ChiefEngineerWalls extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            optional: true,
            target: {
                cardType: ['creature', 'upgrade'],
                location: ['discard'],
                controller: 'self',
                cardCondition: (card => card.hasTrait('robot') || card.type === 'upgrade'),
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

ChiefEngineerWalls.id = 'chief-engineer-walls';

module.exports = ChiefEngineerWalls;
