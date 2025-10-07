import Card from '../../Card.js';

class Havoc extends Card {
    // Play: Make a token creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

Havoc.id = 'havoc';

export default Havoc;
