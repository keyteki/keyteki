import Card from '../../Card.js';

class TerribleTeammates extends Card {
    // Play. You may discard a non-Mars card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => !card.hasHouse('mars'),
                gameAction: ability.actions.discard()
            }
        });
    }
}

TerribleTeammates.id = 'terrible-teammates';

export default TerribleTeammates;
