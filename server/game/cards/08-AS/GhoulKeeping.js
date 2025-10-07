import Card from '../../Card.js';

class GhoulKeeping extends Card {
    // Play: Ready a friendly Geistoid creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'ready a friendly Geistoid creature.',
            target: {
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.hasHouse('geistoid'),
                gameAction: ability.actions.ready()
            }
        });
    }
}

GhoulKeeping.id = 'ghoul-keeping';

export default GhoulKeeping;
