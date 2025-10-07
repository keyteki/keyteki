import Card from '../../Card.js';

class BuxBastian extends Card {
    // Scrap: Exalt an enemy flank creature.
    setupCardAbilities(ability) {
        this.scrap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.exalt()
            }
        });
    }
}

BuxBastian.id = 'bux-bastian';

export default BuxBastian;
