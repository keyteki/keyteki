const Card = require('../../Card.js');

class LightOfTheArchons extends Card {
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
