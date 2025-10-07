import Card from '../../Card.js';

class Priest extends Card {
    // Action: Exhaust an enemy creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

Priest.id = 'priest';

export default Priest;
