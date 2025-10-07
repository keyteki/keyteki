import Card from '../../Card.js';

class TheCurator extends Card {
    // Friendly artifacts enter play ready.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'any',
            match: (card) => card.type === 'artifact',
            effect: ability.effects.entersPlayReady()
        });
    }
}

TheCurator.id = 'the-curator';

export default TheCurator;
