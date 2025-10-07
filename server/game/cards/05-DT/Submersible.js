import Card from '../../Card.js';

class Submersible extends Card {
    // (T) While the tide is high, each friendly Thief creature gains elusive.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.isTideHigh(),
            match: (card) => card.type === 'creature' && card.hasTrait('thief'),
            effect: ability.effects.addKeyword({
                elusive: 1
            })
        });
    }
}

Submersible.id = 'submersible';

export default Submersible;
