const Card = require('../../Card.js');

class SeraphicArmor extends Card {
    // This creature gets +1 armor.
    // Play: Fully heal this creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.heal((context) => ({
                fully: true,
                target: context.source.parent
            }))
        });
        this.whileAttached({
            effect: ability.effects.modifyArmor(1)
        });
    }
}

SeraphicArmor.id = 'seraphic-armor';

module.exports = SeraphicArmor;
