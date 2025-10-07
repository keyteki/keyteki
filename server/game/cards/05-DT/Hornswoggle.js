import Card from '../../Card.js';

class Hornswoggle extends Card {
    // Play: Use an enemy artifact as if it were yours.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.use()
            }
        });
    }
}

Hornswoggle.id = 'hornswoggle';

export default Hornswoggle;
