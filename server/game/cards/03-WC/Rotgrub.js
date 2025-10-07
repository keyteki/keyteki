import Card from '../../Card.js';

class Rotgrub extends Card {
    // Play: Your opponent loses 1A.
    // Reap: Archive Rotgrub.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber()
        });
        this.reap({
            gameAction: ability.actions.archive()
        });
    }
}

Rotgrub.id = 'rotgrub';

export default Rotgrub;
