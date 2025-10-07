import Card from '../../Card.js';

class FrostGiant extends Card {
    // Frost Giant does not ready during your ready cards step.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.doesNotReady()
        });
    }
}

FrostGiant.id = 'frost-giant';

export default FrostGiant;
