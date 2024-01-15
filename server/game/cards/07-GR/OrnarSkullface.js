const Card = require('../../Card.js');

class OrnarSkullface extends Card {
    // Scrap: Deal 3 to a creature.
    setupCardAbilities(ability) {
        this.scrap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        });
    }
}

OrnarSkullface.id = 'ornar-skullface';

module.exports = OrnarSkullface;
