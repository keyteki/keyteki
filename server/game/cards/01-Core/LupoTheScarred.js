const Card = require('../../Card.js');

class LupoTheScarred extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Play: Deal 2D to an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

LupoTheScarred.id = 'lupo-the-scarred';

module.exports = LupoTheScarred;
