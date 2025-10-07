import Card from '../../Card.js';

class Researcher extends Card {
    // Omni: Reveal a Mars Card from your hand and archive it.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => card.hasHouse('mars'),
                gameAction: ability.actions.archive({ reveal: true })
            }
        });
    }
}

Researcher.id = 'researcher';

export default Researcher;
