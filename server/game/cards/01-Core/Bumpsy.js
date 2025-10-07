import Card from '../../Card.js';

class Bumpsy extends Card {
    // Play: Your opponent loses 1<A>.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber()
        });
    }
}

Bumpsy.id = 'bumpsy';

export default Bumpsy;
