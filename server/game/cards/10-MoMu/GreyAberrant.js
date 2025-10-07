import Card from '../../Card.js';

class GreyAberrant extends Card {
    // Each creature loses each of its traits.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.removeAllTraits()
        });
    }
}

GreyAberrant.id = 'grey-aberrant';

export default GreyAberrant;
