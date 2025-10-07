import Card from '../../Card.js';

class Mollymawk extends Card {
    // Play: Destroy an artifact.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Mollymawk.id = 'mollymawk';

export default Mollymawk;
