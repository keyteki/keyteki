import Card from '../../Card.js';

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

export default OrnarSkullface;
