const Card = require('../../Card.js');

class HeavyAdornment extends Card {
    // This creature gains, "After Reap: Exalt each of this creature's neighbors."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.exalt((context) => ({
                    target: context.source.neighbors
                }))
            })
        });
    }
}

HeavyAdornment.id = 'heavy-adornment';

module.exports = HeavyAdornment;
