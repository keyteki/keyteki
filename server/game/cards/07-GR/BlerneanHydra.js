const Card = require('../../Card.js');

class BlerneanHydra extends Card {
    // While it is damaged, Blernean Hydra gains splash-attack X,
    // where X is the amount of damage on Blernean Hydra.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.tokens.damage > 0,
            effect: ability.effects.addKeyword((_, context) => ({
                'splash-attack': context.source.tokens.damage
            }))
        });
    }
}

BlerneanHydra.id = 'blernean-hydra';

module.exports = BlerneanHydra;
