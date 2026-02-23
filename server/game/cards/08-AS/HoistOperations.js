import Card from '../../Card.js';
class HoistOperations extends Card {
    // Play: Put a creature into its owner’s archives.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'any',
                gameAction: ability.actions.archive()
            }
        });
    }
}

HoistOperations.id = 'hoist-operations';

export default HoistOperations;
