const Card = require('../../Card.js');

class ChiefEngineerWalls extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Play/Fight/Reap: You may return an upgrade or Robot card from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            optional: true,
            target: {
                location: ['discard'],
                controller: 'self',
                cardCondition: (card) => card.hasTrait('robot') || card.type === 'upgrade',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

ChiefEngineerWalls.id = 'chief-engineer-walls';

module.exports = ChiefEngineerWalls;
