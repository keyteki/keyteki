import Card from '../../Card.js';

class Paragon extends Card {
    // If there is a Mutant creature in play, Paragon enters play enraged.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.creaturesInPlay.some((c) => c.hasTrait('mutant')),
            effect: [ability.effects.entersPlayEnraged()],
            location: 'any'
        });
    }
}

Paragon.id = 'paragon';

export default Paragon;
