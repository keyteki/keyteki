import Card from '../../Card.js';

class MegaMogghunter extends Card {
    // Fight: Deal 2D to a flank creature.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

MegaMogghunter.id = 'mega-mogghunter';

export default MegaMogghunter;
