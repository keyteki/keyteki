const Card = require('../../Card.js');

class LightOfTheArchons extends Card {
    // This creature gets +1 power and +1 armor for each upgrade attached to it.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyPower(() => this.parent.upgrades.length),
                ability.effects.modifyArmor(() => this.parent.upgrades.length)
            ]
        });
    }
}

LightOfTheArchons.id = 'light-of-the-archons';

module.exports = LightOfTheArchons;
