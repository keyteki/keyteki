import Card from '../../Card.js';

class FurtherTestingNeeded extends Card {
    // Play: Put a friendly card into its owner's archives.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.archive({
                    owner: true
                })
            }
        });
    }
}

FurtherTestingNeeded.id = 'further-testing-needed';

export default FurtherTestingNeeded;
